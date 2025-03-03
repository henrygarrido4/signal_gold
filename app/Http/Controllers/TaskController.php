<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Requests\TaskRequest;
use Inertia\Inertia;
use App\Http\Controllers\ProjectController;
use App\Models\User;
use App\Models\TodoProject;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Task::with(['creator', 'project', 'assignedUsers'])
                ->when($request->project_id, function ($q) use ($request) {
                    return $q->where('project_id', $request->project_id);
                })
                ->orderBy('order', 'asc')
                ->orderBy('created_at', 'desc');

            $tasks = $query->get()->map(function ($task) {
                return [
                    'id' => $task->id,
                    'task_id' => $task->task_id,
                    'title' => $task->title,
                    'description' => $task->description,
                    'project' => [
                        'id' => $task->project->id,
                        'name' => $task->project->name
                    ],
                    'creator' => [
                        'id' => $task->creator->id,
                        'name' => $task->creator->name,
                        'avatar' => $task->creator->profile_photo_url
                    ],
                    'due_date' => $task->due_date->format('Y-m-d'),
                    'priority' => $task->priority,
                    'status' => $task->status,
                    'order' => $task->order,
                    'assigned_users' => $task->assignedUsers->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'name' => $user->name,
                            'avatar' => $user->profile_photo_url
                        ];
                    })
                ];
            });

            $users = User::select('id', 'name', 'profile_photo_path')
                ->get()
                ->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'avatar' => $user->profile_photo_url
                    ];
                })
                ->values()
                ->all();

            Log::info('Users data:', ['users' => $users]);

            return Inertia::render('apps/todo', [
                'tasks' => $tasks,
                'projects' => TodoProject::where('creator_id', Auth::id())->get(),
                'users' => $users
            ]);
        } catch (\Exception $e) {
            Log::error('Error in TaskController@index: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while loading tasks.');
        }
    }

    public function store(Request $request)
    {
        try {
            Log::info('Store request data:', $request->all());

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'project_id' => 'required|exists:todo_projects,id',
                'assigned_user_ids' => 'required|array',
                'assigned_user_ids.*' => 'exists:users,id',
                'due_date' => 'required|date',
                'priority' => 'required|in:high,medium,low',
                'status' => 'required|in:new,in_progress,pending,completed'
            ]);

            $maxOrder = Task::max('order') ?? 0;

            $task = Task::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'project_id' => $validated['project_id'],
                'creator_id' => Auth::id(),
                'due_date' => $validated['due_date'],
                'priority' => $validated['priority'],
                'status' => $validated['status'],
                'order' => $maxOrder + 1
            ]);

            Log::info('Created task:', ['task' => $task]);

            $task->assignedUsers()->sync($validated['assigned_user_ids']);

            Log::info('Assigned users:', ['user_ids' => $validated['assigned_user_ids']]);

            return back()->with('success', 'Task created successfully');
        } catch (\Exception $e) {
            Log::error('Error in TaskController@store: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to create task: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:todo_projects,id',
            'assigned_user_ids' => 'required|array',
            'assigned_user_ids.*' => 'exists:users,id',
            'due_date' => 'required|date',
            'priority' => 'required|in:high,medium,low',
            'status' => 'required|in:new,in_progress,pending,completed'
        ]);

        $task->update($validated);
        $task->assignedUsers()->sync($validated['assigned_user_ids']);

        return back()->with('success', 'Task updated successfully');
    }

    public function updateStatus(Request $request, Task $task)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,in_progress,pending,completed'
        ]);

        $task->update(['status' => $validated['status']]);
        return back()->with('success', 'Task status updated');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return back()->with('success', 'Task deleted successfully');
    }

    public function reorder(Request $request)
    {
        $tasks = $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.order' => 'required|integer'
        ]);

        try {
            DB::transaction(function () use ($tasks) {
                foreach ($tasks['tasks'] as $task) {
                    Task::where('id', $task['id'])->update(['order' => $task['order']]);
                }
            });

            return back();
        } catch (\Exception $e) {
            Log::error('Error reordering tasks: ' . $e->getMessage());
            return back()->with('error', 'Failed to update task order');
        }
    }
}
