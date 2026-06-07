<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Creates:
     *  - 1 admin user (Project Manager)
     *  - 2 regular users (Team Members)
     *  - 3 sample projects
     *  - 6 sample tasks distributed across projects and users
     */
    public function run(): void
    {
        // ── Users ─────────────────────────────────────────────────────────────
        $admin = User::create([
            'name'     => 'Admin Manager',
            'email'    => 'admin@kopikuy.test',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        $alice = User::create([
            'name'     => 'Alice Johnson',
            'email'    => 'alice@kopikuy.test',
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]);

        $bob = User::create([
            'name'     => 'Bob Williams',
            'email'    => 'bob@kopikuy.test',
            'password' => Hash::make('password'),
            'role'     => 'user',
        ]);

        // ── Projects ──────────────────────────────────────────────────────────
        $projectAlpha = Project::create([
            'name'        => 'Project Alpha',
            'description' => 'A flagship product launch initiative focused on mobile-first development.',
            'status'      => 'active',
        ]);

        $projectBeta = Project::create([
            'name'        => 'Project Beta',
            'description' => 'Internal tooling improvements and developer experience upgrades.',
            'status'      => 'active',
        ]);

        $projectGamma = Project::create([
            'name'        => 'Project Gamma',
            'description' => 'Legacy system migration — now fully completed and archived.',
            'status'      => 'completed',
        ]);

        // ── Tasks ─────────────────────────────────────────────────────────────
        Task::create([
            'project_id' => $projectAlpha->id,
            'user_id'    => $alice->id,
            'title'      => 'Design landing page wireframes',
            'status'     => 'done',
        ]);

        Task::create([
            'project_id' => $projectAlpha->id,
            'user_id'    => $bob->id,
            'title'      => 'Implement REST API endpoints',
            'status'     => 'in_progress',
        ]);

        Task::create([
            'project_id' => $projectAlpha->id,
            'user_id'    => $alice->id,
            'title'      => 'Write unit tests for auth module',
            'status'     => 'todo',
        ]);

        Task::create([
            'project_id' => $projectBeta->id,
            'user_id'    => $bob->id,
            'title'      => 'Upgrade CI/CD pipeline',
            'status'     => 'in_progress',
        ]);

        Task::create([
            'project_id' => $projectBeta->id,
            'user_id'    => $alice->id,
            'title'      => 'Refactor database query layer',
            'status'     => 'todo',
        ]);

        Task::create([
            'project_id' => $projectGamma->id,
            'user_id'    => $bob->id,
            'title'      => 'Decommission old server instances',
            'status'     => 'done',
        ]);

        $this->command->info('✅  Seeding complete!');
        $this->command->table(
            ['Role', 'Name', 'Email', 'Password'],
            [
                ['admin', $admin->name, $admin->email, 'password'],
                ['user',  $alice->name, $alice->email, 'password'],
                ['user',  $bob->name,   $bob->email,   'password'],
            ]
        );
    }
}
