<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use App\Http\Resources\TaskResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     *
     * GET /api/dashboard
     */
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User $authUser */
        $authUser = $request->user();
        $isAdmin  = $authUser->isAdmin();

        // Base query — scoped by role
        $taskQuery = Task::query();
        if (! $isAdmin) {
            $taskQuery->where('user_id', $authUser->id);
        }

        // Task counts by status
        $totalTasks    = (clone $taskQuery)->count();
        $todoCount     = (clone $taskQuery)->where('status', 'todo')->count();
        $progressCount = (clone $taskQuery)->where('status', 'in_progress')->count();
        $doneCount     = (clone $taskQuery)->where('status', 'done')->count();

        // Overdue tasks (due_date in the past, not done)
        $overdueCount = (clone $taskQuery)
            ->where('status', '!=', 'done')
            ->whereNotNull('due_date')
            ->where('due_date', '<', now()->toDateString())
            ->count();

        // Recent tasks
        $recentTasks = (clone $taskQuery)
            ->with(['project', 'user'])
            ->latest()
            ->take(5)
            ->get();

        // Admin-only stats
        $stats = [
            'total_tasks'    => $totalTasks,
            'todo_count'     => $todoCount,
            'progress_count' => $progressCount,
            'done_count'     => $doneCount,
            'overdue_count'  => $overdueCount,
            'recent_tasks'   => TaskResource::collection($recentTasks),
        ];

        if ($isAdmin) {
            $stats['total_projects']  = Project::count();
            $stats['active_projects'] = Project::where('status', 'active')->count();
            $stats['total_users']     = User::count();
        }

        return response()->json([
            'success' => true,
            'message' => 'Dashboard data retrieved.',
            'data'    => $stats,
        ]);
    }
}
