<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ContractResource;
use App\Models\Contract;
use App\Models\Subcontractor;
use Illuminate\Http\Request;

class ContractController extends ApiController
{
    public function store(Request $request, Subcontractor $subcontractor)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'description' => 'required|string|max:255',
            'billed_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $contract = $subcontractor->contracts()->create($validated);
        $contract->load('payments', 'project');

        return $this->success(new ContractResource($contract), 'Contract added.', 201);
    }

    public function update(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'description' => 'required|string|max:255',
            'billed_amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,in_progress,completed,cancelled',
        ]);

        $contract->update($validated);
        $contract->load('payments', 'project');

        return $this->success(new ContractResource($contract), 'Contract updated.');
    }

    public function destroy(Contract $contract)
    {
        $contract->delete();

        return $this->success(null, 'Contract deleted.');
    }
}
