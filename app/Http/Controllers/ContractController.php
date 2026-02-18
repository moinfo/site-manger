<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Subcontractor;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function store(Request $request, Subcontractor $subcontractor)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'description' => 'required|string|max:255',
            'billed_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $subcontractor->contracts()->create($validated);

        return redirect()->route('subcontractors.show', $subcontractor)
            ->with('success', 'Contract added.');
    }

    public function update(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'billed_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $contract->update($validated);

        return redirect()->route('subcontractors.show', $contract->subcontractor_id)
            ->with('success', 'Contract updated.');
    }

    public function destroy(Contract $contract)
    {
        $subcontractorId = $contract->subcontractor_id;
        $contract->delete();

        return redirect()->route('subcontractors.show', $subcontractorId)
            ->with('success', 'Contract deleted.');
    }
}
