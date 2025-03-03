<?php

namespace App\Http\Controllers;

use App\Models\TodoProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TodoProjectController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        try {
            $project = TodoProject::create([
                'name' => $validated['name'],
                'creator_id' => Auth::id()
            ]);

            return back()->with('success', 'Project created successfully');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create project']);
        }
    }

    public function destroy(TodoProject $todoProject)
    {
        try {
            if ($todoProject->creator_id !== Auth::id()) {
                abort(403, 'Unauthorized action.');
            }

            DB::transaction(function () use ($todoProject) {
                // The tasks will be automatically deleted due to the boot method in TodoProject model
                $todoProject->delete();
            });

            return back()->with('success', 'Project and associated tasks deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting project: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to delete project']);
        }
    }
}
