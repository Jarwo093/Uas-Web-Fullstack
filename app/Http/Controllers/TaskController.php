<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * List tasks.
     *  - Admin: all tasks (with project and user relations).
     *  - User:  only their own assigned tasks.
     *
     * GET /api/tasks
     */
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User $authUser */
        $authUser = $request->user();

        $query = Task::with(['project:id,name', 'user:id,name,email']);

        if (! $authUser->isAdmin()) {
            $query->where('user_id', $authUser->id);
        }

        $tasks = $query->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Tasks retrieved successfully.',
            'data'    => $tasks,
        ]);
    }

    /**
     * Create a new task and assign it to a user.
     *
     * POST /api/tasks  [Admin only]
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|integer|exists:projects,id',
            'user_id'    => 'required|integer|exists:users,id',
            'title'      => 'required|string|max:255',
            'status'     => 'sometimes|in:todo,in_progress,done',
        ]);

        $task = Task::create($validated);
        $task->load(['project:id,name', 'user:id,name,email']);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully.',
            'data'    => $task,
        ], 201);
    }

    /**
     * Update only the status of a task.
     *  - Admin: can update any task.
     *  - User:  can only update their own tasks.
     *
     * PUT /api/tasks/{id}/status
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        /** @var \App\Models\User $authUser */
        $authUser = $request->user();

        $task = Task::find($id);

        if (! $task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found.',
                'data'    => null,
            ], 404);
        }

        // Non-admin users may only touch their own tasks.
        if (! $authUser->isAdmin() && $task->user_id !== $authUser->id) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. You can only update your own tasks.',
                'data'    => null,
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:todo,in_progress,done',
        ]);

        $task->update($validated);
        $task->load(['project:id,name', 'user:id,name,email']);

        return response()->json([
            'success' => true,
            'message' => 'Task status updated successfully.',
            'data'    => $task,
        ]);
    }
}
