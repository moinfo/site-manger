<?php

namespace App\Http\Controllers\Api;

use App\Models\CashInflow;
use App\Models\Material;
use App\Models\Project;
use App\Models\Subcontractor;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends ApiController
{
    public function index()
    {
        $now = Carbon::now();
        $currentMonth = $now->month;
        $currentYear = $now->year;

        $spentThisMonth = Material::whereMonth('date', $currentMonth)
            ->whereYear('date', $currentYear)
            ->sum('subtotal');

        $totalSpent = Material::sum('subtotal');
        $totalReceived = CashInflow::sum('amount');
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
        $spendingByCategory = Material::select('category', DB::raw('SUM(subtotal) as total'))
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

        $activeProjects = Project::where('status', 'active')->count();
        $totalProjects = Project::count();
        $totalSubcontractors = Subcontractor::count();

        // Monthly cash flow trend (last 6 months)
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
            'cash_in' => (float) ($cashInByMonth[$m] ?? 0),
            'cash_out' => (float) ($cashOutByMonth[$m] ?? 0),
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

        return $this->success([
            'stats' => [
                'spent_this_month' => (float) $spentThisMonth,
                'total_spent' => (float) $totalSpent,
                'total_received' => (float) $totalReceived,
                'cash_balance' => (float) $cashBalance,
                'active_projects' => $activeProjects,
                'total_projects' => $totalProjects,
                'total_subcontractors' => $totalSubcontractors,
            ],
            'monthly_spending' => $monthlySpending,
            'monthly_cash_flow' => $monthlyCashFlow,
            'spending_by_category' => $spendingByCategory,
            'project_budgets' => $projectBudgets,
            'subcontractor_balances' => $subcontractors->values(),
            'recent_expenses' => $recentExpenses,
        ]);
    }
}
