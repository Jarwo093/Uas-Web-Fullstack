<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get the authenticated user's profile.
     *
     * GET /api/me
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'User profile retrieved.',
            'data'    => new UserResource($request->user()),
        ]);
    }

    /**
     * List all users (Admin only — for task assignment dropdowns).
     *
     * GET /api/users
     */
    public function index(): JsonResponse
    {
        $users = User::orderBy('name')->get();

        return response()->json([
            'success' => true,
            'message' => 'Users retrieved successfully.',
            'data'    => UserResource::collection($users),
        ]);
    }
}
