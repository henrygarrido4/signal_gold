<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class TeamController extends Controller
{
    public function index()
    {
        try {
            $totalUsers = User::count();
            Log::info('Total users in database:', ['count' => $totalUsers]);

            if ($totalUsers === 0) {
                Log::error('No users found in database');
                return Inertia::render('pages/team', ['users' => []]);
            }

            // Get users with their projects
            $users = User::select([
                'id',
                'name',
                'email',
                'profile_photo_path',
                'cover_photo_path',
                'designation',
                'city',
                'country',
                'description'
            ])
                ->withCount([
                    'projects',                    // Total projects count
                    'projects as active_projects' => function ($query) {
                        $query->where('status', '!=', 'C');
                    }
                ])
                ->get();

            // Log raw project counts for debugging
            Log::info('Raw project counts:', $users->map(function ($user) {
                return [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'total_projects' => $user->projects_count,
                    'active_projects' => $user->active_projects
                ];
            })->toArray());

            $mappedUsers = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'memberImg' => $user->profile_photo_path ? Storage::url($user->profile_photo_path) : null,
                    'cover_photo_path' => $user->cover_photo_url,
                    'nickname' => $this->generateInitials($user->name),
                    'memberName' => $user->name,
                    'position' => $user->designation ?? 'Team Member',
                    'projects' => $user->projects_count ?? 0,    // Total projects
                    'tasks' => $user->active_projects ?? 0,      // Active projects as tasks
                    'email' => $user->email,
                    'location' => $user->city && $user->country ? "{$user->city} - {$user->country}" : null,
                    'description' => $user->description,
                    'bookmark' => false
                ];
            })->values()->all();

            Log::info('Mapped users with project counts:', [
                'count' => count($mappedUsers),
                'users' => collect($mappedUsers)->map(function ($user) {
                    return [
                        'id' => $user['id'],
                        'name' => $user['memberName'],
                        'projects' => $user['projects'],
                        'tasks' => $user['tasks']
                    ];
                })
            ]);

            return Inertia::render('pages/team', [
                'users' => $mappedUsers,
                'auth_id' => auth()->id(),
                'debug' => [
                    'totalUsers' => $totalUsers,
                    'mappedCount' => count($mappedUsers),
                    'projectCounts' => $users->pluck('projects_count', 'id')
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error in TeamController@index:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function generateInitials($name)
    {
        $words = explode(' ', trim($name));
        $initials = '';

        if (count($words) >= 2) {
            $initials = strtoupper(substr($words[0], 0, 1) . substr(end($words), 0, 1));
        } else {
            $initials = strtoupper(substr($name, 0, 2));
        }

        return $initials;
    }
}
