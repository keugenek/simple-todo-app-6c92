<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create some sample tasks
        Task::factory()->create([
            'title' => 'Learn Laravel',
            'description' => 'Complete the Laravel documentation and build a sample project',
            'completed' => true,
        ]);

        Task::factory()->create([
            'title' => 'Build Todo App',
            'description' => 'Create a simple todo application with add, view, and complete functionality',
            'completed' => false,
        ]);

        Task::factory()->create([
            'title' => 'Write Tests',
            'description' => 'Add comprehensive tests for the todo application',
            'completed' => false,
        ]);

        Task::factory()->create([
            'title' => 'Deploy Application',
            'description' => null,
            'completed' => false,
        ]);

        // Create additional random tasks
        Task::factory(5)->create();
    }
}
