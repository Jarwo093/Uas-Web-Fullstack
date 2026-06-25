<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    /**
     * List all projects (paginated).
     *
     * GET /api/projects  [Admin only]
     */
    public function index(): JsonResponse
    {
        $projects = Project::withCount('tasks')
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Projects retrieved successfully.',
            'data'    => ProjectResource::collection($projects),
            'meta'    => [
                'current_page' => $projects->currentPage(),
                'last_page'    => $projects->lastPage(),
                'per_page'     => $projects->perPage(),
                'total'        => $projects->total(),
            ],
        ]);
    }

    /**
     * Create a new project.
     *
     * POST /api/projects  [Admin only]
     */
    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = Project::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully.',
            'data'    => new ProjectResource($project),
        ], 201);
    }

    /**
     * Update an existing project.
     *
     * PUT /api/projects/{project}  [Admin only]
     */
    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $project->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data'    => new ProjectResource($project->fresh()),
        ]);
    }

    /**
     * Delete a project.
     *
     * DELETE /api/projects/{project}  [Admin only]
     */
    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
            'data'    => null,
        ]);
    }
}
