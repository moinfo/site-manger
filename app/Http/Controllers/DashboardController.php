<?php

namespace App\Http\Controllers;

use App\Models\CashInflow;
use App\Models\Material;
use App\Models\Subcontractor;
use App\Models\Project;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $currentMonth = $now->month;
        $currentYear = $now->year;

        // Total spent this month
        $spentThisMonth = Material::whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->sum('subtotal');

        // Total spent overall
        $totalSpent = Material::sum('subtotal');

        // Total received
        $totalReceived = CashInflow::sum('amount');

        // Cash balance
        $cashBalance = $totalReceived - $totalSpent;

        // Monthly spending trend (last 6 months)
        $monthlySpending = Material::select(
                DB::raw("DATE_FORMAT(date, '%Y-%m') as month"),
                DB::raw('SUM(subtotal) as total')
            )
            ->where('date', '>=', $now->copy()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($item) => [
                'month' => Carbon::parse($item->month . '-01')->format('M Y'),
                'total' => (float) $item->total,
            ]);

        // Spending by category
        $spendingByCategory = Material::select(
                'category',
                DB::raw('SUM(subtotal) as total')
            )
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($item) => [
                'category' => ucfirst(str_replace('_', ' ', $item->category)),
                'total' => (float) $item->total,
            ]);

        // Subcontractor balances
        $subcontractors = Subcontractor::with('contracts.payments')
            ->get()
            ->map(fn ($sub) => [
                'id' => $sub->id,
                'name' => $sub->name,
                'total_billed' => $sub->total_billed,
                'total_paid' => $sub->total_paid,
                'balance' => $sub->balance,
            ])
            ->filter(fn ($sub) => $sub['total_billed'] > 0 || $sub['total_paid'] > 0);

        // Recent expenses
        $recentExpenses = Material::with('project')
            ->latest('date')
            ->take(10)
            ->get();

        // Active projects count
        $activeProjects = Project::where('status', 'active')->count();
        $totalProjects = Project::count();
        $totalSubcontractors = Subcontractor::count();

        // Monthly cash flow trend (cash in vs cash out, last 6 months)
        $monthFrom = $now->copy()->subMonths(6)->startOfMonth()->toDateString();

        $cashInByMonth = CashInflow::selectRaw("DATE_FORMAT(date, '%Y-%m') as month, SUM(amount) as total")
            ->where('date', '>=', $monthFrom)
            ->groupByRaw("DATE_FORMAT(date, '%Y-%m')")
            ->pluck('total', 'month');

        $cashOutByMonth = Material::selectRaw("DATE_FORMAT(date, '%Y-%m') as month, SUM(subtotal) as total")
            ->where('date', '>=', $monthFrom)
            ->groupByRaw("DATE_FORMAT(date, '%Y-%m')")
            ->pluck('total', 'month');

        $allMonths = $cashInByMonth->keys()->merge($cashOutByMonth->keys())->unique()->sort()->values();
        $monthlyCashFlow = $allMonths->map(fn ($m) => [
            'month' => Carbon::parse($m . '-01')->format('M Y'),
            'Cash In' => (float) ($cashInByMonth[$m] ?? 0),
            'Cash Out' => (float) ($cashOutByMonth[$m] ?? 0),
        ]);

        // Project budgets vs spent
        $projectBudgets = Project::withSum('materials as spent', 'subtotal')
            ->orderByDesc('budget')
            ->limit(6)
            ->get()
            ->map(fn ($p) => [
                'name' => $p->name,
                'budget' => (float) $p->budget,
                'spent' => (float) ($p->spent ?? 0),
                'percentage' => $p->budget > 0 ? round(($p->spent ?? 0) / $p->budget * 100, 1) : 0,
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'spent_this_month' => (float) $spentThisMonth,
                'total_spent' => (float) $totalSpent,
                'total_received' => (float) $totalReceived,
                'cash_balance' => (float) $cashBalance,
                'active_projects' => $activeProjects,
                'total_projects' => $totalProjects,
                'total_subcontractors' => $totalSubcontractors,
            ],
            'monthlySpending' => $monthlySpending,
            'monthlyCashFlow' => $monthlyCashFlow,
            'spendingByCategory' => $spendingByCategory,
            'projectBudgets' => $projectBudgets,
            'subcontractorBalances' => $subcontractors->values(),
            'recentExpenses' => $recentExpenses,
        ]);
    }
}
