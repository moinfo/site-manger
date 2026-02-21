<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\MaterialResource;
use App\Models\Material;
use App\Models\Project;
use Illuminate\Http\Request;

class ExpenseController extends ApiController
{
    public function index(Request $request)
    {
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

        $expenses = $query->latest('date')->paginate(25);

        return MaterialResource::collection($expenses);
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

        $expense = Material::create($validated);
        $expense->load('project', 'recorder');

        return $this->success(new MaterialResource($expense), 'Expense recorded.', 201);
    }

    public function show(Material $expense)
    {
        $expense->load('project', 'recorder');

        return $this->success(new MaterialResource($expense));
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
        $expense->load('project', 'recorder');

        return $this->success(new MaterialResource($expense), 'Expense updated.');
    }

    public function destroy(Material $expense)
    {
        $expense->delete();

        return $this->success(null, 'Expense deleted.');
    }

    public function categories()
    {
        return $this->success(Material::categoryOptions());
    }
}
