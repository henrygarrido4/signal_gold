<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show($id)
    {
        $user = User::findOrFail($id);

        $userData = array_merge($user->toArray(), [
            'profile_photo_url' => $user->profile_photo_path ? Storage::url($user->profile_photo_path) : null,
            'cover_photo_url' => $user->cover_photo_url,
            'location' => $user->city && $user->country
                ? "{$user->city}, {$user->country}"
                : ($user->city ? $user->city : $user->country),
            'skills' => is_array($user->skills) ? $user->skills : [],
            'projects_count' => $user->projects()->count(),
            'active_projects_count' => $user->projects()->where('status', '!=', 'C')->count(),
        ]);

        return Inertia::render('pages/profile/show', [
            'user' => $userData
        ]);
    }
}
