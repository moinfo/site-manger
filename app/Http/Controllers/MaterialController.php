<?php

namespace App\Http\Controllers;

use App\Models\Material;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        // Default to current month if no dates provided
        if (!$request->filled('date_from') && !$request->filled('date_to')) {
            $request->merge([
                'date_from' => now()->startOfMonth()->toDateString(),
                'date_to' => now()->toDateString(),
            ]);
        }

        $query = Material::with('project', 'recorder');

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $expenses = $query->latest('date')->paginate(25)->withQueryString();

        $totalFiltered = $query->sum('subtotal');

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'filters' => $request->only(['project_id', 'category', 'date_from', 'date_to', 'search']),
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'categories' => Material::categoryOptions(),
            'totalFiltered' => (float) $totalFiltered,
        ]);
    }

    public function create()
    {
        return Inertia::render('Expenses/Create', [
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'categories' => Material::categoryOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'date' => 'required|date',
            'description' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'nullable|string|max:50',
            'unit_price' => 'required|numeric|min:0',
            'category' => 'required|in:' . implode(',', array_keys(Material::categoryOptions())),
        ]);

        $validated['subtotal'] = $validated['quantity'] * $validated['unit_price'];
        $validated['recorded_by'] = $request->user()->id;

        Material::create($validated);

        return redirect()->route('expenses.index')
            ->with('success', 'Expense recorded successfully.');
    }

    public function edit(Material $expense)
    {
        return Inertia::render('Expenses/Edit', [
            'expense' => $expense,
            'projects' => Project::orderBy('name')->get(['id', 'name']),
            'categories' => Material::categoryOptions(),
        ]);
    }

    public function update(Request $request, Material $expense)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'date' => 'required|date',
            'description' => 'required|string|max:255',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'nullable|string|max:50',
            'unit_price' => 'required|numeric|min:0',
            'category' => 'required|in:' . implode(',', array_keys(Material::categoryOptions())),
        ]);

        $validated['subtotal'] = $validated['quantity'] * $validated['unit_price'];

        $expense->update($validated);

        return redirect()->route('expenses.index')
            ->with('success', 'Expense updated successfully.');
    }

    public function destroy(Material $expense)
    {
        $expense->delete();

        return redirect()->route('expenses.index')
            ->with('success', 'Expense deleted.');
    }
}
