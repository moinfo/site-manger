<?php

namespace App\Http\Controllers;

use App\Models\CashInflow;
use App\Models\Material;
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

    public function export(string $type)
    {
        return match ($type) {
            'monthly-expenses-pdf' => $this->monthlyExpensesPdf(),
            'monthly-expenses-excel' => $this->monthlyExpensesExcel(),
            'subcontractors-pdf' => $this->subcontractorsPdf(),
            'subcontractors-excel' => $this->subcontractorsExcel(),
            'cashflow-pdf' => $this->cashflowPdf(),
            'cashflow-excel' => $this->cashflowExcel(),
            default => abort(404),
        };
    }

    private function monthlyExpensesPdf()
    {
        $data = Material::select(
                DB::raw("strftime('%Y-%m', date) as month"),
                'category',
                DB::raw('SUM(subtotal) as total')
            )
            ->groupBy('month', 'category')
            ->orderBy('month')
            ->get()
            ->groupBy('month');

        $grandTotal = Material::sum('subtotal');

        $pdf = Pdf::loadView('reports.monthly-expenses', [
            'data' => $data,
            'grandTotal' => $grandTotal,
            'categories' => Material::categoryOptions(),
        ]);

        return $pdf->download('monthly-expenses-report.pdf');
    }

    private function monthlyExpensesExcel()
    {
        $materials = Material::select('date', 'description', 'quantity', 'unit', 'unit_price', 'subtotal', 'category')
            ->orderBy('date')
            ->get();

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

    private function subcontractorsPdf()
    {
        $subcontractors = Subcontractor::with('contracts.payments')->get();

        $pdf = Pdf::loadView('reports.subcontractors', [
            'subcontractors' => $subcontractors,
        ]);

        return $pdf->download('subcontractors-report.pdf');
    }

    private function subcontractorsExcel()
    {
        $subcontractors = Subcontractor::with('contracts.payments')->get();

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

    private function cashflowPdf()
    {
        $inflows = CashInflow::orderBy('date')->get();
        $totalIn = CashInflow::sum('amount');
        $totalOut = Material::sum('subtotal');

        $pdf = Pdf::loadView('reports.cashflow', [
            'inflows' => $inflows,
            'totalIn' => $totalIn,
            'totalOut' => $totalOut,
            'balance' => $totalIn - $totalOut,
        ]);

        return $pdf->download('cashflow-report.pdf');
    }

    private function cashflowExcel()
    {
        $inflows = CashInflow::orderBy('date')->get();

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
}
