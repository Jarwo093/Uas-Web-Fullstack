<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $regularUser;
    private string $adminToken;
    private string $userToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->regularUser = User::factory()->create(['role' => 'user']);
        $this->adminToken = $this->admin->createToken('test')->plainTextToken;
        $this->userToken = $this->regularUser->createToken('test')->plainTextToken;
    }

    public function test_admin_can_list_projects(): void
    {
        Project::factory(3)->create();

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->getJson('/api/projects');

        $response->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonStructure(['data', 'meta' => ['total', 'current_page']]);
    }

    public function test_regular_user_cannot_list_projects(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->userToken}")
            ->getJson('/api/projects');

        $response->assertStatus(403);
    }

    public function test_admin_can_create_project(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/projects', [
                'name'        => 'New Project',
                'description' => 'A test project',
                'status'      => 'active',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data'    => ['name' => 'New Project'],
            ]);

        $this->assertDatabaseHas('projects', ['name' => 'New Project']);
    }

    public function test_project_creation_fails_without_name(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->postJson('/api/projects', [
                'description' => 'Missing name',
            ]);

        $response->assertStatus(422);
    }

    public function test_admin_can_update_project(): void
    {
        $project = Project::factory()->create(['name' => 'Old Name']);

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->putJson("/api/projects/{$project->id}", [
                'name' => 'Updated Name',
            ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'data'    => ['name' => 'Updated Name'],
            ]);
    }

    public function test_admin_can_delete_project(): void
    {
        $project = Project::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer {$this->adminToken}")
            ->deleteJson("/api/projects/{$project->id}");

        $response->assertOk()
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_regular_user_cannot_create_project(): void
    {
        $response = $this->withHeader('Authorization', "Bearer {$this->userToken}")
            ->postJson('/api/projects', ['name' => 'Nope']);

        $response->assertStatus(403);
    }
}
