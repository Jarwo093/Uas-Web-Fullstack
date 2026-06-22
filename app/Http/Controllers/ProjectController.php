<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * List all projects.
     *
     * GET /api/projects  [Admin only]
     */
    public function index(): JsonResponse
    {
        $projects = Project::withCount('tasks')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Projects retrieved successfully.',
            'data'    => $projects,
        ]);
    }

    /**
     * Create a new project.
     *
     * POST /api/projects  [Admin only]
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'sometimes|in:active,completed',
        ]);

        $project = Project::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully.',
            'data'    => $project,
        ], 201);
    }

    /**
     * Update an existing project.
     *
     * PUT /api/projects/{id}  [Admin only]
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $project = Project::find($id);

        if (! $project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found.',
                'data'    => null,
            ], 404);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'sometimes|in:active,completed',
        ]);

        $project->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data'    => $project->fresh(),
        ]);
    }

    /**
     * Delete a project.
     *
     * DELETE /api/projects/{id}  [Admin only]
     */
    public function destroy(int $id): JsonResponse
    {
        $project = Project::find($id);

        if (! $project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found.',
                'data'    => null,
            ], 404);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
            'data'    => null,
        ]);
    }
}
