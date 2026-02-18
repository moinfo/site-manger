<?php

namespace App\Http\Controllers;

use App\Models\CashInflow;
use App\Models\FinancialCharge;
use App\Models\Material;
use App\Models\Project;
use App\Models\Subcontractor;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index');
    }

    public function monthly(Request $request)
    {
        $query = Material::select(
                DB::raw("strftime('%Y-%m', date) as month"),
                'category',
                DB::raw('SUM(subtotal) as total')
            );

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $data = $query->groupBy('month', 'category')
            ->orderBy('month')
            ->get()
            ->groupBy('month');

        $totalQuery = Material::query();
        if ($request->filled('project_id')) {
            $totalQuery->where('project_id', $request->project_id);
        }
        if ($request->filled('date_from')) {
            $totalQuery->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $totalQuery->where('date', '<=', $request->date_to);
        }
        $grandTotal = $totalQuery->sum('subtotal');

        return Inertia::render('Reports/MonthlyExpenses', [
            'data' => $data,
            'grandTotal' => $grandTotal,
            'categories' => Material::categoryOptions(),
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['project_id', 'date_from', 'date_to']),
        ]);
    }

    public function subcontractors(Request $request)
    {
        $query = Subcontractor::with(['contracts' => function ($q) use ($request) {
            if ($request->filled('project_id')) {
                $q->where('project_id', $request->project_id);
            }
            $q->with(['payments' => function ($pq) use ($request) {
                if ($request->filled('date_from')) {
                    $pq->where('date', '>=', $request->date_from);
                }
                if ($request->filled('date_to')) {
                    $pq->where('date', '<=', $request->date_to);
                }
            }]);
        }]);

        $subcontractors = $query->get();

        // Filter out subcontractors with no contracts after project filter
        if ($request->filled('project_id')) {
            $subcontractors = $subcontractors->filter(fn ($s) => $s->contracts->isNotEmpty())->values();
        }

        return Inertia::render('Reports/SubcontractorSummary', [
            'subcontractors' => $subcontractors,
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['project_id', 'date_from', 'date_to']),
        ]);
    }

    public function cashflow(Request $request)
    {
        $inflowQuery = CashInflow::orderBy('date');
        $totalInQuery = CashInflow::query();
        $totalOutQuery = Material::query();

        if ($request->filled('project_id')) {
            $inflowQuery->where('project_id', $request->project_id);
            $totalInQuery->where('project_id', $request->project_id);
            $totalOutQuery->where('project_id', $request->project_id);
        }
        if ($request->filled('date_from')) {
            $inflowQuery->where('date', '>=', $request->date_from);
            $totalInQuery->where('date', '>=', $request->date_from);
            $totalOutQuery->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $inflowQuery->where('date', '<=', $request->date_to);
            $totalInQuery->where('date', '<=', $request->date_to);
            $totalOutQuery->where('date', '<=', $request->date_to);
        }

        $inflows = $inflowQuery->get();
        $totalIn = $totalInQuery->sum('amount');
        $totalOut = $totalOutQuery->sum('subtotal');

        return Inertia::render('Reports/CashFlowStatement', [
            'inflows' => $inflows,
            'totalIn' => $totalIn,
            'totalOut' => $totalOut,
            'balance' => $totalIn - $totalOut,
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['project_id', 'date_from', 'date_to']),
        ]);
    }

    public function projectStatement(Request $request)
    {
        // Default to current month if no dates provided
        if (!$request->filled('date_from') && !$request->filled('date_to')) {
            $request->merge([
                'date_from' => now()->startOfMonth()->toDateString(),
                'date_to' => now()->toDateString(),
            ]);
        }

        $statementData = $this->buildProjectStatement($request);

        return Inertia::render('Reports/ProjectStatement', [
            'transactions' => $statementData['transactions'],
            'openingBalance' => $statementData['openingBalance'],
            'totalDebit' => $statementData['totalDebit'],
            'totalCredit' => $statementData['totalCredit'],
            'closingBalance' => $statementData['closingBalance'],
            'projectName' => $statementData['projectName'],
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['project_id', 'date_from', 'date_to']),
        ]);
    }

    public function export(Request $request, string $type)
    {
        return match ($type) {
            'monthly-expenses-pdf' => $this->monthlyExpensesPdf($request),
            'monthly-expenses-excel' => $this->monthlyExpensesExcel($request),
            'subcontractors-pdf' => $this->subcontractorsPdf($request),
            'subcontractors-excel' => $this->subcontractorsExcel($request),
            'cashflow-pdf' => $this->cashflowPdf($request),
            'cashflow-excel' => $this->cashflowExcel($request),
            'project-statement-pdf' => $this->projectStatementPdf($request),
            'project-statement-excel' => $this->projectStatementExcel($request),
            default => abort(404),
        };
    }

    private function applyMaterialFilters($query, Request $request)
    {
        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        return $query;
    }

    private function monthlyExpensesPdf(Request $request)
    {
        $query = Material::select(
                DB::raw("strftime('%Y-%m', date) as month"),
                'category',
                DB::raw('SUM(subtotal) as total')
            );

        $data = $this->applyMaterialFilters($query, $request)
            ->groupBy('month', 'category')
            ->orderBy('month')
            ->get()
            ->groupBy('month');

        $grandTotal = $this->applyMaterialFilters(Material::query(), $request)->sum('subtotal');

        $pdf = Pdf::loadView('reports.monthly-expenses', [
            'data' => $data,
            'grandTotal' => $grandTotal,
            'categories' => Material::categoryOptions(),
        ]);

        return $pdf->download('monthly-expenses-report.pdf');
    }

    private function monthlyExpensesExcel(Request $request)
    {
        $query = Material::select('date', 'description', 'quantity', 'unit', 'unit_price', 'subtotal', 'category')
            ->orderBy('date');

        $materials = $this->applyMaterialFilters($query, $request)->get();

        $csv = "Date,Description,Qty,Unit,Price,Subtotal,Category\n";
        foreach ($materials as $m) {
            $csv .= sprintf(
                "%s,\"%s\",%s,%s,%s,%s,%s\n",
                $m->date->format('Y-m-d'), $m->description, $m->quantity,
                $m->unit, $m->unit_price, $m->subtotal, $m->category
            );
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename=expenses-report.csv');
    }

    private function subcontractorsPdf(Request $request)
    {
        $subcontractors = $this->filteredSubcontractors($request);

        $pdf = Pdf::loadView('reports.subcontractors', [
            'subcontractors' => $subcontractors,
        ]);

        return $pdf->download('subcontractors-report.pdf');
    }

    private function subcontractorsExcel(Request $request)
    {
        $subcontractors = $this->filteredSubcontractors($request);

        $csv = "Subcontractor,Contract,Billed,Paid,Balance,Status\n";
        foreach ($subcontractors as $sub) {
            foreach ($sub->contracts as $c) {
                $paid = $c->payments->sum('amount');
                $csv .= sprintf(
                    "\"%s\",\"%s\",%s,%s,%s,%s\n",
                    $sub->name, $c->description, $c->billed_amount,
                    $paid, $c->billed_amount - $paid, $c->status
                );
            }
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename=subcontractors-report.csv');
    }

    private function filteredSubcontractors(Request $request)
    {
        $query = Subcontractor::with(['contracts' => function ($q) use ($request) {
            if ($request->filled('project_id')) {
                $q->where('project_id', $request->project_id);
            }
            $q->with(['payments' => function ($pq) use ($request) {
                if ($request->filled('date_from')) {
                    $pq->where('date', '>=', $request->date_from);
                }
                if ($request->filled('date_to')) {
                    $pq->where('date', '<=', $request->date_to);
                }
            }]);
        }]);

        $subcontractors = $query->get();

        if ($request->filled('project_id')) {
            $subcontractors = $subcontractors->filter(fn ($s) => $s->contracts->isNotEmpty())->values();
        }

        return $subcontractors;
    }

    private function cashflowPdf(Request $request)
    {
        $inflowQuery = CashInflow::orderBy('date');
        $totalInQuery = CashInflow::query();
        $totalOutQuery = Material::query();

        foreach ([$inflowQuery, $totalInQuery] as $q) {
            if ($request->filled('project_id')) {
                $q->where('project_id', $request->project_id);
            }
            if ($request->filled('date_from')) {
                $q->where('date', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $q->where('date', '<=', $request->date_to);
            }
        }
        $this->applyMaterialFilters($totalOutQuery, $request);

        $inflows = $inflowQuery->get();
        $totalIn = $totalInQuery->sum('amount');
        $totalOut = $totalOutQuery->sum('subtotal');

        $pdf = Pdf::loadView('reports.cashflow', [
            'inflows' => $inflows,
            'totalIn' => $totalIn,
            'totalOut' => $totalOut,
            'balance' => $totalIn - $totalOut,
        ]);

        return $pdf->download('cashflow-report.pdf');
    }

    private function cashflowExcel(Request $request)
    {
        $query = CashInflow::orderBy('date');

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $inflows = $query->get();

        $csv = "Date,Source,Amount,Notes\n";
        foreach ($inflows as $i) {
            $csv .= sprintf(
                "%s,\"%s\",%s,\"%s\"\n",
                $i->date->format('Y-m-d'), $i->source, $i->amount, $i->notes ?? ''
            );
        }

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename=cashflow-report.csv');
    }

    private function buildProjectStatement(Request $request): array
    {
        $projectId = $request->input('project_id');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $projectName = null;
        if ($projectId) {
            $projectName = Project::find($projectId)?->name;
        }

        // --- Opening balance: all transactions BEFORE date_from ---
        // Debit = cash in, Credit = cash out (matches Dashboard: CashInflow - Material)
        $openingBalance = 0;
        if ($dateFrom) {
            $debitsBefore = CashInflow::when($projectId, fn ($q) => $q->where('project_id', $projectId))
                ->where('date', '<', $dateFrom)->sum('amount');
            $creditsBefore = Material::when($projectId, fn ($q) => $q->where('project_id', $projectId))
                ->where('date', '<', $dateFrom)->sum('subtotal');
            $openingBalance = $debitsBefore - $creditsBefore;
        }

        // --- Build transaction rows within range ---
        $rows = collect();

        // Debit (Cash Inflows = money in)
        $inflowQuery = CashInflow::when($projectId, fn ($q) => $q->where('project_id', $projectId));
        if ($dateFrom) $inflowQuery->where('date', '>=', $dateFrom);
        if ($dateTo) $inflowQuery->where('date', '<=', $dateTo);
        foreach ($inflowQuery->orderBy('date')->get() as $r) {
            $rows->push([
                'date' => $r->date->format('Y-m-d'),
                'description' => 'Cash In: ' . $r->source,
                'debit' => (float) $r->amount,
                'credit' => 0,
            ]);
        }

        // Credit (Material expenses = money out)
        $materialQuery = Material::when($projectId, fn ($q) => $q->where('project_id', $projectId));
        if ($dateFrom) $materialQuery->where('date', '>=', $dateFrom);
        if ($dateTo) $materialQuery->where('date', '<=', $dateTo);
        foreach ($materialQuery->orderBy('date')->get() as $r) {
            $rows->push([
                'date' => $r->date->format('Y-m-d'),
                'description' => 'Expense: ' . $r->description,
                'debit' => 0,
                'credit' => (float) $r->subtotal,
            ]);
        }

        // Sort by date
        $rows = $rows->sortBy('date')->values();

        // Compute running balance: opening + debits - credits
        $running = $openingBalance;
        $transactions = [];
        foreach ($rows as $row) {
            $running += $row['debit'] - $row['credit'];
            $row['balance'] = $running;
            $transactions[] = $row;
        }

        $totalDebit = collect($transactions)->sum('debit');
        $totalCredit = collect($transactions)->sum('credit');

        return [
            'transactions' => $transactions,
            'openingBalance' => $openingBalance,
            'totalDebit' => $totalDebit,
            'totalCredit' => $totalCredit,
            'closingBalance' => $running,
            'projectName' => $projectName,
        ];
    }

    private function projectStatementPdf(Request $request)
    {
        $data = $this->buildProjectStatement($request);

        $pdf = Pdf::loadView('reports.project-statement', $data);

        return $pdf->download('project-statement.pdf');
    }

    private function projectStatementExcel(Request $request)
    {
        $data = $this->buildProjectStatement($request);

        $csv = "Date,Description,Debit,Credit,Balance\n";

        // Opening balance row
        $csv .= sprintf(",Opening Balance,,,%.0f\n", $data['openingBalance']);

        foreach ($data['transactions'] as $t) {
            $csv .= sprintf(
                "%s,\"%s\",%.0f,%.0f,%.0f\n",
                $t['date'], $t['description'], $t['debit'], $t['credit'], $t['balance']
            );
        }

        // Closing balance row
        $csv .= sprintf(",Closing Balance,%.0f,%.0f,%.0f\n",
            $data['totalDebit'], $data['totalCredit'], $data['closingBalance']);

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename=project-statement.csv');
    }
}
