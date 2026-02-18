<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Subcontractor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubcontractorController extends Controller
{
    public function index()
    {
        $subcontractors = Subcontractor::with('contracts.payments')
            ->get()
            ->map(function ($sub) {
                $sub->total_billed = $sub->total_billed;
                $sub->total_paid = $sub->total_paid;
                $sub->balance = $sub->balance;
                return $sub;
            });

        return Inertia::render('Subcontractors/Index', [
            'subcontractors' => $subcontractors,
        ]);
    }

    public function create()
    {
        return Inertia::render('Subcontractors/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        Subcontractor::create($validated);

        return redirect()->route('subcontractors.index')
            ->with('success', 'Subcontractor added.');
    }

    public function show(Subcontractor $subcontractor)
    {
        $subcontractor->load('contracts.payments', 'contracts.project');

        return Inertia::render('Subcontractors/Show', [
            'subcontractor' => $subcontractor,
            'projects' => Project::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function edit(Subcontractor $subcontractor)
    {
        return Inertia::render('Subcontractors/Edit', [
            'subcontractor' => $subcontractor,
        ]);
    }

    public function update(Request $request, Subcontractor $subcontractor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $subcontractor->update($validated);

        return redirect()->route('subcontractors.show', $subcontractor)
            ->with('success', 'Subcontractor updated.');
    }

    public function destroy(Subcontractor $subcontractor)
    {
        $subcontractor->delete();

        return redirect()->route('subcontractors.index')
            ->with('success', 'Subcontractor deleted.');
    }
}
