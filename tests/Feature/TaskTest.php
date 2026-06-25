<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $alice;
    private User $bob;
    private Project $project;
    private string $adminToken;
    private string $aliceToken;
    private string $bobToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->alice = User::factory()->create(['role' => 'user', 'name' => 'Alice']);
        $this->bob   = User::factory()->create(['role' => 'user', 'name' => 'Bob']);
        $this->project = Project::factory()->create();

        $this->adminToken = $this->admin->createToken('test')->plainTextToken;
        $this->aliceToken = $this->alice->createToken('test')->plainTextToken;
        $this->bobToken   = $this->bob->createToken('test')->plainTextToken;
    }

    public function test_admin_sees_all_tasks(): void
    {
        Task::factory(3)->create(['project_id' => $this->project->id, 'user_id' => $this->alice->id]);
        Task::factory(2)->create(['project_id' => $this->project->id, 'user_id' => $this->bob->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/tasks');

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertCount(5, $response->json('data'));
    }

    public function test_user_sees_only_own_tasks(): void
    {
        Task::factory(3)->create(['project_id' => $this->project->id, 'user_id' => $this->alice->id]);
        Task::factory(2)->create(['project_id' => $this->project->id, 'user_id' => $this->bob->id]);

        $response = $this->withHeader('Authorization', "Bearer {$this->aliceToken}")
            ->getJson('/api/tasks');

        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }

    public function test_admin_can_create_task(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/tasks', [
                'project_id' => $this->project->id,
                'user_id'    => $this->alice->id,
                'title'      => 'New Task',
                'priority'   => 'high',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data'    => ['title' => 'New Task', 'priority' => 'high'],
            ]);
    }

    public function test_regular_user_cannot_create_task(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->aliceToken}")
            ->postJson('/api/tasks', [
                'project_id' => $this->project->id,
                'user_id'    => $this->alice->id,
                'title'      => 'Nope',
            ]);

        $response->assertStatus(403);
    }

    public function test_user_can_update_own_task_status(): void
    {
        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'user_id'    => $this->alice->id,
            'status'     => 'todo',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->aliceToken}")
            ->putJson("/api/tasks/{$task->id}/status", ['status' => 'in_progress']);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data'    => ['status' => 'in_progress'],
            ]);
    }

    public function test_user_cannot_update_other_users_task(): void
    {
        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'user_id'    => $this->alice->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->bobToken}")
            ->putJson("/api/tasks/{$task->id}/status", ['status' => 'done']);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_any_task_status(): void
    {
        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'user_id'    => $this->alice->id,
            'status'     => 'todo',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/tasks/{$task->id}/status", ['status' => 'done']);

        $response->assertOk()
            ->assertJson(['data' => ['status' => 'done']]);
    }

    public function test_task_filter_by_status(): void
    {
        Task::factory()->create(['project_id' => $this->project->id, 'user_id' => $this->admin->id, 'status' => 'todo']);
        Task::factory()->create(['project_id' => $this->project->id, 'user_id' => $this->admin->id, 'status' => 'done']);
        Task::factory()->create(['project_id' => $this->project->id, 'user_id' => $this->admin->id, 'status' => 'done']);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/tasks?status=done');

        $response->assertOk();
        $this->assertCount(2, $response->json('data'));
    }

    public function test_task_search_by_title(): void
    {
        Task::factory()->create(['project_id' => $this->project->id, 'user_id' => $this->admin->id, 'title' => 'Design wireframes']);
        Task::factory()->create(['project_id' => $this->project->id, 'user_id' => $this->admin->id, 'title' => 'Write documentation']);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/tasks?search=wireframe');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_task_show_returns_detail(): void
    {
        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'user_id'    => $this->alice->id,
            'title'      => 'Detail Task',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->aliceToken}")
            ->getJson("/api/tasks/{$task->id}");

        $response->assertOk()
            ->assertJson(['data' => ['title' => 'Detail Task']]);
    }

    public function test_user_cannot_view_other_users_task(): void
    {
        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'user_id'    => $this->alice->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->bobToken}")
            ->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(403);
    }

    public function test_admin_can_update_task(): void
    {
        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'user_id'    => $this->alice->id,
            'title'      => 'Original Title',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/tasks/{$task->id}", [
                'project_id'  => $this->project->id,
                'user_id'     => $this->bob->id,
                'title'       => 'Updated Title',
                'description' => 'Updated Desc',
                'status'      => 'in_progress',
                'priority'    => 'low',
                'due_date'    => '2026-12-31',
            ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data'    => [
                    'title'       => 'Updated Title',
                    'description' => 'Updated Desc',
                    'status'      => 'in_progress',
                    'priority'    => 'low',
                ]
            ]);

        $this->assertDatabaseHas('tasks', [
            'id'      => $task->id,
            'title'   => 'Updated Title',
            'user_id' => $this->bob->id,
        ]);
    }

    public function test_regular_user_cannot_update_task(): void
    {
        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'user_id'    => $this->alice->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->aliceToken}")
            ->putJson("/api/tasks/{$task->id}", [
                'project_id'  => $this->project->id,
                'user_id'     => $this->alice->id,
                'title'       => 'Hacker Title',
                'status'      => 'done',
                'priority'    => 'high',
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_delete_task(): void
    {
        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'user_id'    => $this->alice->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_regular_user_cannot_delete_task(): void
    {
        $task = Task::factory()->create([
            'project_id' => $this->project->id,
            'user_id'    => $this->alice->id,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$this->aliceToken}")
            ->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
    }
}
