<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * List tasks (paginated, with search & filtering).
     *  - Admin: all tasks
     *  - User:  only their own assigned tasks
     *
     * GET /api/tasks?status=todo&project_id=1&search=wireframe&page=1
     */
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User $authUser */
        $authUser = $request->user();

        $query = Task::with(['project', 'user']);

        // Scope by role
        if (! $authUser->isAdmin()) {
            $query->where('user_id', $authUser->id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by project
        if ($request->filled('project_id')) {
            $query->where('project_id', $request->input('project_id'));
        }

        // Filter by assigned user (admin only)
        if ($request->filled('user_id') && $authUser->isAdmin()) {
            $query->where('user_id', $request->input('user_id'));
        }

        // Filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->input('priority'));
        }

        // Search by title
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        $tasks = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Tasks retrieved successfully.',
            'data'    => TaskResource::collection($tasks),
            'meta'    => [
                'current_page' => $tasks->currentPage(),
                'last_page'    => $tasks->lastPage(),
                'per_page'     => $tasks->perPage(),
                'total'        => $tasks->total(),
            ],
        ]);
    }

    /**
     * Show a single task.
     *
     * GET /api/tasks/{task}
     */
    public function show(Request $request, Task $task): JsonResponse
    {
        /** @var \App\Models\User $authUser */
        $authUser = $request->user();

        // Non-admin can only view their own tasks
        if (! $authUser->isAdmin() && $task->user_id !== $authUser->id) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. You can only view your own tasks.',
                'data'    => null,
            ], 403);
        }

        $task->load(['project', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Task retrieved successfully.',
            'data'    => new TaskResource($task),
        ]);
    }

    /**
     * Create a new task and assign it to a user.
     *
     * POST /api/tasks  [Admin only]
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = Task::create($request->validated());
        $task->load(['project', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully.',
            'data'    => new TaskResource($task),
        ], 201);
    }

    /**
     * Update only the status of a task.
     *  - Admin: can update any task.
     *  - User:  can only update their own tasks.
     *
     * PUT /api/tasks/{task}/status
     */
    public function updateStatus(UpdateTaskStatusRequest $request, Task $task): JsonResponse
    {
        /** @var \App\Models\User $authUser */
        $authUser = $request->user();

        // Non-admin users may only touch their own tasks.
        if (! $authUser->isAdmin() && $task->user_id !== $authUser->id) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. You can only update your own tasks.',
                'data'    => null,
            ], 403);
        }

        $task->update($request->validated());
        $task->load(['project', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Task status updated successfully.',
            'data'    => new TaskResource($task),
        ]);
    }

    /**
     * Update task details (Admin only).
     *
     * PUT /api/tasks/{task}
     */
    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $task->update($request->validated());
        $task->load(['project', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'data'    => new TaskResource($task),
        ]);
    }

    /**
     * Delete a task (Admin only).
     *
     * DELETE /api/tasks/{task}
     */
    public function destroy(Task $task): JsonResponse
    {
        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully.',
            'data'    => null,
        ]);
    }
}
