<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectComment;
use App\Models\CommentAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProjectCommentController extends Controller
{
    public function store(Request $request, Project $project)
    {
        Log::info('Comment request received:', [
            'content' => $request->input('content'),
            'has_files' => $request->hasFile('attachments'),
            'files_count' => $request->hasFile('attachments') ? count($request->file('attachments')) : 0
        ]);

        $validated = $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:project_comments,id',
            'attachments.*' => 'nullable|file|max:10240'
        ]);

        DB::beginTransaction();
        try {
            $comment = $project->comments()->create([
                'content' => $validated['content'],
                'user_id' => Auth::id(),
                'parent_id' => $validated['parent_id'] ?? null
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('comment-attachments', 'public');

                    $comment->attachments()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'type' => $file->getMimeType(),
                        'size' => $file->getSize()
                    ]);
                }
            }

            DB::commit();

            $comment->load(['user', 'replies.user', 'attachments']);
            $comment->attachments->each(function ($attachment) {
                $attachment->url = Storage::disk('public')->url($attachment->path);
            });

            return back()->with('success', 'Comment added successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Comment creation failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['error' => 'Failed to create comment']);
        }
    }

    public function update(Request $request, ProjectComment $comment)
    {
        // Check if user can edit this comment
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $comment->update($validated);

        return back()->with('success', 'Comment updated successfully');
    }

    public function destroy(ProjectComment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        DB::beginTransaction();
        try {
            // Delete attachments from storage
            foreach ($comment->attachments as $attachment) {
                Storage::disk('public')->delete($attachment->path);
            }

            $comment->delete();
            DB::commit();

            return back()->with('success', 'Comment deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete comment');
        }
    }

    public function downloadAttachment(CommentAttachment $attachment)
    {
        $comment = $attachment->comment;
        if (!$comment) {
            abort(404, 'Comment not found');
        }

        $project = $comment->project;
        if (!$project) {
            abort(404, 'Project not found');
        }

        if (!$project->canBeAccessedBy(auth()->user())) {
            abort(403, 'Unauthorized access');
        }

        if (!Storage::disk('public')->exists($attachment->path)) {
            abort(404, 'File not found');
        }

        // Return the file with original filename
        return Storage::disk('public')->download(
            $attachment->path,
            $attachment->name,  // This ensures the original filename is used
            [
                'Content-Type' => $attachment->type,
                'Content-Disposition' => 'attachment; filename="' . $attachment->name . '"'
            ]
        );
    }
}
