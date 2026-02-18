<?php

namespace App\Http\Controllers;

use App\Models\ChargeCategory;
use App\Models\FinancialCharge;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialChargeController extends Controller
{
    public function index(Request $request)
    {
        $query = FinancialCharge::with('project', 'category');

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->filled('charge_category_id')) {
            $query->where('charge_category_id', $request->charge_category_id);
        }

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        // Clone query before pagination for accurate total
        $totalFiltered = (clone $query)->sum('amount');

        $charges = $query->latest('date')->paginate(25)->withQueryString();

        return Inertia::render('Charges/Index', [
            'charges' => $charges,
            'filters' => $request->only(['project_id', 'charge_category_id', 'date_from', 'date_to']),
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'categories' => ChargeCategory::orderBy('name')->get(['id', 'name']),
            'totalFiltered' => (float) $totalFiltered,
        ]);
    }

    public function create()
    {
        return Inertia::render('Charges/Create', [
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'categories' => ChargeCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'charge_category_id' => 'required|exists:charge_categories,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);

        $validated['recorded_by'] = $request->user()->id;

        FinancialCharge::create($validated);

        return redirect()->route('charges.index')
            ->with('success', 'Charge recorded successfully.');
    }

    public function edit(FinancialCharge $charge)
    {
        return Inertia::render('Charges/Edit', [
            'charge' => $charge,
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'categories' => ChargeCategory::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, FinancialCharge $charge)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'charge_category_id' => 'required|exists:charge_categories,id',
            'date' => 'required|date',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
        ]);

        $charge->update($validated);

        return redirect()->route('charges.index')
            ->with('success', 'Charge updated successfully.');
    }

    public function destroy(FinancialCharge $charge)
    {
        $charge->delete();

        return redirect()->route('charges.index')
            ->with('success', 'Charge deleted.');
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:charge_categories,name',
        ]);

        ChargeCategory::create($validated);

        return back()->with('success', 'Category created.');
    }

    public function destroyCategory(ChargeCategory $chargeCategory)
    {
        if ($chargeCategory->financialCharges()->exists()) {
            return back()->with('error', 'Cannot delete a category that has charges.');
        }

        $chargeCategory->delete();

        return back()->with('success', 'Category deleted.');
    }
}
