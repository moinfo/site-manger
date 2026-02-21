<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SubcontractorResource;
use App\Models\Project;
use App\Models\Subcontractor;
use Illuminate\Http\Request;

class SubcontractorController extends ApiController
{
    public function index()
    {
        $subcontractors = Subcontractor::with('contracts.payments')->get();

        return SubcontractorResource::collection($subcontractors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $subcontractor = Subcontractor::create($validated);

        return $this->success(new SubcontractorResource($subcontractor), 'Subcontractor added.', 201);
    }

    public function show(Subcontractor $subcontractor)
    {
        $subcontractor->load('contracts.payments', 'contracts.project');

        return $this->success(new SubcontractorResource($subcontractor));
    }

    public function update(Request $request, Subcontractor $subcontractor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $subcontractor->update($validated);

        return $this->success(new SubcontractorResource($subcontractor), 'Subcontractor updated.');
    }

    public function destroy(Subcontractor $subcontractor)
    {
        $subcontractor->delete();

        return $this->success(null, 'Subcontractor deleted.');
    }
}
