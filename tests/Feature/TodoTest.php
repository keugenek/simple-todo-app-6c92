<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TodoTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_todo_homepage(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->has('tasks')
        );
    }

    public function test_can_create_task(): void
    {
        $taskData = [
            'title' => 'Test Task',
            'description' => 'This is a test task description',
        ];

        $response = $this->post(route('tasks.store'), $taskData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'description' => 'This is a test task description',
            'completed' => false,
        ]);
    }

    public function test_can_mark_task_as_completed(): void
    {
        $task = Task::factory()->create(['completed' => false]);

        $response = $this->patch(route('tasks.update', $task), [
            'title' => $task->title,
            'description' => $task->description,
            'completed' => true,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'completed' => true,
        ]);
    }

    public function test_can_mark_task_as_pending(): void
    {
        $task = Task::factory()->completed()->create();

        $response = $this->patch(route('tasks.update', $task), [
            'title' => $task->title,
            'description' => $task->description,
            'completed' => false,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'completed' => false,
        ]);
    }

    public function test_can_delete_task(): void
    {
        $task = Task::factory()->create();

        $response = $this->delete(route('tasks.destroy', $task));

        $response->assertStatus(200);
        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_task_title_is_required(): void
    {
        $response = $this->post(route('tasks.store'), [
            'title' => '',
            'description' => 'This task has no title',
        ]);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_task_title_cannot_exceed_255_characters(): void
    {
        $response = $this->post(route('tasks.store'), [
            'title' => str_repeat('a', 256),
            'description' => 'This task has a very long title',
        ]);

        $response->assertSessionHasErrors(['title']);
    }

    public function test_homepage_displays_tasks_correctly(): void
    {
        // Create some test tasks in specific order
        $completedTask = Task::factory()->completed()->create([
            'title' => 'Completed Task'
        ]);
        // Sleep to ensure different created_at timestamps
        sleep(1);
        $pendingTask = Task::factory()->pending()->create([
            'title' => 'Pending Task'
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('welcome')
            ->has('tasks', 2)
            ->where('tasks.0.title', 'Pending Task') // Latest first
            ->where('tasks.1.title', 'Completed Task')
        );
    }
}