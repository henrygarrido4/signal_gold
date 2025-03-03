<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ProfilePhotoController extends Controller
{
    public function update(Request $request)
    {
        try {
            $request->validate([
                'photo' => ['required', 'image', 'max:1024']
            ]);

            Log::info('Profile photo update attempt', [
                'user_id' => auth()->id(),
                'has_file' => $request->hasFile('photo'),
                'file_info' => $request->file('photo')
            ]);

            if (!$request->hasFile('photo')) {
                Log::error('No photo file found in request');
                return back()->withErrors(['photo' => 'No photo file was uploaded.']);
            }

            $photo = $request->file('photo');
            if (!$photo->isValid()) {
                Log::error('Invalid photo file', ['error' => $photo->getErrorMessage()]);
                return back()->withErrors(['photo' => 'The uploaded file is invalid.']);
            }

            $user = auth()->user();
            $user->updateProfilePhoto($photo);

            Log::info('Profile photo updated successfully', ['user_id' => $user->id]);
            return back()->with('success', 'Profile photo updated successfully.');
        } catch (\Exception $e) {
            Log::error('Profile photo update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['photo' => 'Failed to update profile photo: ' . $e->getMessage()]);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:1024']
        ]);

        $user = $request->user();

        // Delete old photo if exists
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        // Store new photo
        $path = $request->file('photo')->store('profile-photos', 'public');

        $user->profile_photo_path = $path;
        $user->save();

        return back(303);
    }

    public function destroy()
    {
        $user = Auth::user();

        // Delete photo if exists
        if ($user->profile_photo_path && Storage::disk('public')->exists($user->profile_photo_path)) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        $user->profile_photo_path = null;
        $user->save();

        return back()->with('success', 'Profile photo removed successfully.');
    }

    public function updateCover(Request $request)
    {
        try {
            Log::info('Cover photo update attempt', [
                'user_id' => auth()->id(),
                'has_file' => $request->hasFile('cover'),
                'file_info' => $request->file('cover')
            ]);

            $request->validate([
                'cover' => ['required', 'image', 'max:2048']  // 2MB max
            ]);

            if (!$request->hasFile('cover')) {
                Log::error('No cover file found in request');
                return back()->withErrors(['cover' => 'No cover file was uploaded.']);
            }

            $cover = $request->file('cover');
            if (!$cover->isValid()) {
                Log::error('Invalid cover file', ['error' => $cover->getErrorMessage()]);
                return back()->withErrors(['cover' => 'The uploaded file is invalid.']);
            }

            $user = auth()->user();

            // Delete old cover photo if exists
            if ($user->cover_photo_path) {
                Storage::disk('public')->delete($user->cover_photo_path);
            }

            // Store new cover photo
            $path = $cover->store('cover-photos', 'public');

            $user->cover_photo_path = $path;
            $user->save();

            Log::info('Cover photo updated successfully', ['user_id' => $user->id, 'path' => $path]);
            return back()->with('success', 'Cover photo updated successfully.');
        } catch (\Exception $e) {
            Log::error('Cover photo update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['cover' => 'Failed to update cover photo: ' . $e->getMessage()]);
        }
    }
}
