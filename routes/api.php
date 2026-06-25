<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
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

// ─── Public Routes (rate-limited) ────────────────────────────────────────────
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ─── Protected Routes (requires valid Sanctum Bearer token) ──────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [UserController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // ── User Routes (Admin only) ────────────────────────────────────────────
    Route::middleware('is_admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
    });

    // ── Project Routes (Admin only) ──────────────────────────────────────────
    Route::middleware('is_admin')->group(function () {
        Route::get('/projects',         [ProjectController::class, 'index']);
        Route::post('/projects',        [ProjectController::class, 'store']);
        Route::put('/projects/{project}',    [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    });

    // ── Task Routes ──────────────────────────────────────────────────────────
    Route::get('/tasks',                   [TaskController::class, 'index']);
    Route::get('/tasks/{task}',            [TaskController::class, 'show']);
    Route::put('/tasks/{task}/status',     [TaskController::class, 'updateStatus']);

    // Task creation and management is Admin only
    Route::middleware('is_admin')->group(function () {
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::put('/tasks/{task}', [TaskController::class, 'update']);
        Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
    });
});
