<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_gets_full_dashboard_stats(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user  = User::factory()->create(['role' => 'user']);
        $project = Project::factory()->create();

        Task::factory(2)->create(['project_id' => $project->id, 'user_id' => $user->id, 'status' => 'todo']);
        Task::factory(1)->create(['project_id' => $project->id, 'user_id' => $user->id, 'status' => 'in_progress']);
        Task::factory(3)->create(['project_id' => $project->id, 'user_id' => $user->id, 'status' => 'done']);

        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data' => [
                    'total_tasks'    => 6,
                    'todo_count'     => 2,
                    'progress_count' => 1,
                    'done_count'     => 3,
                    'total_projects' => 1,
                ],
            ]);
    }

    public function test_regular_user_gets_scoped_dashboard(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $alice = User::factory()->create(['role' => 'user']);
        $bob   = User::factory()->create(['role' => 'user']);
        $project = Project::factory()->create();

        Task::factory(3)->create(['project_id' => $project->id, 'user_id' => $alice->id, 'status' => 'todo']);
        Task::factory(2)->create(['project_id' => $project->id, 'user_id' => $bob->id, 'status' => 'done']);

        $token = $alice->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'total_tasks' => 3,
                    'todo_count'  => 3,
                    'done_count'  => 0,
                ],
            ]);

        // Should NOT have admin-only stats
        $this->assertArrayNotHasKey('total_projects', $response->json('data'));
    }
}
