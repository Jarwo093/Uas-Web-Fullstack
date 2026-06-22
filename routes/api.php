<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes here are automatically prefixed with /api by Laravel.
| Authentication is handled via Laravel Sanctum (Bearer tokens).
|
*/

// ─── Public Routes ────────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ─── Protected Routes (requires valid Sanctum Bearer token) ──────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // ── Project Routes (Admin only) ──────────────────────────────────────────
    Route::middleware('is_admin')->group(function () {
        Route::get('/projects',        [ProjectController::class, 'index']);
        Route::post('/projects',       [ProjectController::class, 'store']);
        Route::put('/projects/{id}',   [ProjectController::class, 'update']);
        Route::delete('/projects/{id}',[ProjectController::class, 'destroy']);
    });

    // ── Task Routes ──────────────────────────────────────────────────────────
    // GET  /api/tasks            → All users (filtered by role inside controller)
    // POST /api/tasks            → Admin only (checked inside controller via middleware)
    // PUT  /api/tasks/{id}/status → All authenticated users (ownership checked inside)
    Route::get('/tasks',                   [TaskController::class, 'index']);
    Route::put('/tasks/{id}/status',       [TaskController::class, 'updateStatus']);

    // Task creation is Admin only
    Route::middleware('is_admin')->group(function () {
        Route::post('/tasks', [TaskController::class, 'store']);
    });
});
