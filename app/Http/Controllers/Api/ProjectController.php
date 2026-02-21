<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends ApiController
{
    public function index()
    {
        $projects = Project::withSum('materials as total_spent', 'subtotal')
            ->withSum('cashInflows as total_received', 'amount')
            ->latest()
            ->get();

        return ProjectResource::collection($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,completed,on_hold',
        ]);

        $project = Project::create($validated);

        return $this->success(new ProjectResource($project), 'Project created.', 201);
    }

    public function show(Project $project)
    {
        $project->loadSum('materials as total_spent', 'subtotal');
        $project->loadSum('cashInflows as total_received', 'amount');

        return $this->success(new ProjectResource($project));
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,completed,on_hold',
        ]);

        $project->update($validated);

        return $this->success(new ProjectResource($project), 'Project updated.');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return $this->success(null, 'Project deleted.');
    }
}
