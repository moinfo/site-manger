<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\CashInflowResource;
use App\Models\CashInflow;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CashFlowController extends ApiController
{
    public function index(Request $request)
    {
        $inflowQuery = CashInflow::with('project', 'recorder');
        $materialQuery = Material::query();

        if ($request->filled('project_id')) {
            $inflowQuery->where('project_id', $request->project_id);
            $materialQuery->where('project_id', $request->project_id);
        }
        if ($request->filled('date_from')) {
            $inflowQuery->where('date', '>=', $request->date_from);
            $materialQuery->where('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $inflowQuery->where('date', '<=', $request->date_to);
            $materialQuery->where('date', '<=', $request->date_to);
        }

        $inflows = (clone $inflowQuery)->latest('date')->paginate(25);
        $totalIn = (clone $inflowQuery)->sum('amount');
        $totalOut = (clone $materialQuery)->sum('subtotal');

        // Monthly summary
        $projectFilter = $request->filled('project_id') ? (int) $request->project_id : null;
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $inSql = CashInflow::selectRaw("DATE_FORMAT(date, '%Y-%m') as month, SUM(amount) as cash_in, 0 as cash_out")
            ->when($projectFilter, fn ($q) => $q->where('project_id', $projectFilter))
            ->when($dateFrom, fn ($q) => $q->where('date', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->where('date', '<=', $dateTo))
            ->groupByRaw("DATE_FORMAT(date, '%Y-%m')");

        $outSql = Material::selectRaw("DATE_FORMAT(date, '%Y-%m') as month, 0 as cash_in, SUM(subtotal) as cash_out")
            ->when($projectFilter, fn ($q) => $q->where('project_id', $projectFilter))
            ->when($dateFrom, fn ($q) => $q->where('date', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->where('date', '<=', $dateTo))
            ->groupByRaw("DATE_FORMAT(date, '%Y-%m')");

        $monthlySummary = DB::query()
            ->fromSub($inSql->unionAll($outSql), 'combined')
            ->selectRaw('month, SUM(cash_in) as cash_in, SUM(cash_out) as cash_out')
            ->groupBy('month')
            ->orderByDesc('month')
            ->limit(12)
            ->get();

        return $this->success([
            'inflows' => CashInflowResource::collection($inflows),
            'monthly_summary' => $monthlySummary,
            'total_in' => (float) $totalIn,
            'total_out' => (float) $totalOut,
            'balance' => (float) ($totalIn - $totalOut),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'date' => 'required|date',
            'source' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string|max:255',
        ]);

        $validated['recorded_by'] = $request->user()->id;

        $inflow = CashInflow::create($validated);
        $inflow->load('project', 'recorder');

        return $this->success(new CashInflowResource($inflow), 'Cash inflow recorded.', 201);
    }

    public function destroy(CashInflow $cashInflow)
    {
        $cashInflow->delete();

        return $this->success(null, 'Cash inflow deleted.');
    }
}
