<?php

namespace App\Http\Controllers;

use App\Models\CashInflow;
use App\Models\Material;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CashInflowController extends Controller
{
    public function index(Request $request)
    {
        $inflows = CashInflow::with('project')
            ->latest('date')
            ->paginate(25);

        // Monthly summary
        $monthlySummary = DB::select("
            SELECT
                month,
                SUM(cash_in) as cash_in,
                SUM(cash_out) as cash_out
            FROM (
                SELECT strftime('%Y-%m', date) as month, SUM(amount) as cash_in, 0 as cash_out
                FROM cash_inflows
                GROUP BY strftime('%Y-%m', date)
                UNION ALL
                SELECT strftime('%Y-%m', date) as month, 0 as cash_in, SUM(subtotal) as cash_out
                FROM materials
                GROUP BY strftime('%Y-%m', date)
            ) combined
            GROUP BY month
            ORDER BY month DESC
            LIMIT 12
        ");

        $totalIn = CashInflow::sum('amount');
        $totalOut = Material::sum('subtotal');

        return Inertia::render('CashFlow/Index', [
            'inflows' => $inflows,
            'monthlySummary' => $monthlySummary,
            'totalIn' => (float) $totalIn,
            'totalOut' => (float) $totalOut,
            'balance' => (float) ($totalIn - $totalOut),
            'projects' => Project::orderBy('name')->get(['id', 'name']),
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

        CashInflow::create($validated);

        return redirect()->route('cashflow.index')
            ->with('success', 'Cash inflow recorded.');
    }

    public function destroy(CashInflow $cashInflow)
    {
        $cashInflow->delete();

        return redirect()->route('cashflow.index')
            ->with('success', 'Cash inflow deleted.');
    }
}
