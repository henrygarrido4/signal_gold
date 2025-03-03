<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;

class ProjectController extends Controller
{
    // Show create project form
    public function create()
    {
        return Inertia::render('apps/projects/create', [
            'users' => User::select('id', 'name', 'email', 'profile_photo_path')->get()
        ]);
    }

    // Store project and redirect to List.vue
    public function store(Request $request)
    {
        try {
            // Parse team members from JSON string to array before validation
            $data = $request->all();
            if (isset($data['team_members']) && is_string($data['team_members'])) {
                $data['team_members'] = json_decode($data['team_members'], true);
            }

            // Convert privacy value to expected format
            if (isset($data['privacy'])) {
                $data['privacy'] = match ($data['privacy']) {
                    'Private' => 'P',
                    'Team' => 'T',
                    'Public' => 'PU',
                    default => $data['privacy']
                };
            }

            $validationRules = [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'priority' => 'required',
                'status' => 'required',
                'deadline' => 'required|date_format:Y-m-d',
                'privacy' => 'required|in:PU,P,T', // Public, Private, Team
                'skills' => 'required',
                'team_members' => [
                    'nullable',
                    'array',
                    Rule::requiredIf(fn() => $data['privacy'] === 'T')
                ],
                'team_lead' => [
                    'nullable',
                    Rule::requiredIf(fn() => $data['privacy'] === 'T'),
                    'exists:users,id'
                ],
                'category' => 'nullable|string' // Make category optional
            ];

            $validatedData = Validator::make($data, $validationRules)->validate();

            // If project is private, ensure team members and team lead are null
            if ($validatedData['privacy'] === 'P') {
                $validatedData['team_members'] = [];
                $validatedData['team_lead'] = null;
            }

            // Set default thumbnail if none provided
            $thumbnail = 'images/default-project.png';

            // Handle thumbnail if provided
            if ($request->hasFile('thumbnail')) {
                $thumbnail = $request->file('thumbnail')->store('project-thumbnails', 'public');
            }

            // Create the project
            $project = Project::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'priority' => $this->convertPriority($validatedData['priority']),
                'status' => $this->convertStatus($validatedData['status']),
                'deadline' => $validatedData['deadline'],
                'privacy' => $validatedData['privacy'],
                'category' => $validatedData['category'] ?? 'Development', // Set default category
                'skills' => is_string($validatedData['skills']) ? $validatedData['skills'] : json_encode($validatedData['skills']),
                'team_lead' => $validatedData['team_lead'],
                'team_members' => json_encode($validatedData['team_members'] ?? []),
                'thumbnail' => $thumbnail ?? 'images/default-project.png',
                'user_id' => Auth::id(),
            ]);

            // Now sync the team members
            if (!empty($validatedData['team_members'])) {
                $project->users()->sync($validatedData['team_members']);
            }

            // Handle attached files
            if ($request->hasFile('attached_files')) {
                $files = [];
                foreach ($request->file('attached_files') as $file) {
                    $originalName = $file->getClientOriginalName();
                    // Get file extension
                    $extension = $file->getClientOriginalExtension();
                    // Create a sanitized base name
                    $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
                    // Create unique filename while preserving original name
                    $filename = $baseName . '_' . time() . '_' . uniqid() . '.' . $extension;

                    $path = $file->storeAs('project-files', $filename, 'public');
                    $files[] = [
                        'path' => $path,
                        'name' => $originalName,
                        'display_name' => $originalName,
                        'system_name' => $filename,
                        'size' => $file->getSize(),
                        'type' => $file->getMimeType(),
                        'url' => URL::to(route('projects.download', ['filename' => basename($path)])),
                        'download_url' => URL::to(route('projects.download', ['filename' => basename($path)]))
                    ];
                }
                $project->attached_files = $files;
                $project->save();
            }

            // Return with success message
            session()->flash('success', 'Project created successfully');
            return Inertia::location(route('projects.index'));
        } catch (\Exception $e) {
            Log::error('Project creation error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'error' => 'Failed to create project: ' . $e->getMessage()
            ]);
        }
    }

    // Show project list page (List.vue)
    public function index(Request $request)
    {
        $userId = Auth::id();

        Log::info('Fetching projects for user:', [
            'user_id' => $userId,
            'filters' => [
                'search' => $request->input('search'),
                'bookmarked' => $request->boolean('bookmarked', false)
            ]
        ]);

        $projects = Project::with('users')
            ->where(function ($query) use ($userId) {
                $query->where('privacy', 'PU') // Public projects
                    ->orWhere('user_id', $userId) // Projects created by user
                    ->orWhere(function ($q) use ($userId) {
                        $q->where('privacy', 'T') // Team projects
                            ->whereHas('users', function ($u) use ($userId) {
                                $u->where('users.id', $userId);
                            });
                    });
            });

        Log::info('Projects query:', [
            'sql' => $projects->toSql(),
            'bindings' => $projects->getBindings(),
            'team_projects_count' => (clone $projects)
                ->where('privacy', 'T')
                ->whereHas('users', function ($q) use ($userId) {
                    $q->where('users.id', $userId);
                })->count()
        ]);

        $search = $request->input('search');
        $showBookmarked = $request->boolean('bookmarked', false);

        $projects = $projects->when($showBookmarked, function ($query) use ($userId) {
            $query->whereHas('bookmarks', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            });
        })
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'ilike', "%{$search}%")
                        ->orWhere('description', 'ilike', "%{$search}%")
                        ->orWhere('category', 'ilike', "%{$search}%")
                        ->orWhereJsonContains('skills', $search);
                });
            })
            ->orderBy('updated_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(8)
            ->through(function ($project) use ($userId) {
                // Convert single letter status to full text
                $project->status = match ($project->status) {
                    'C' => 'Completed',
                    'I' => 'In Progress',
                    'N' => 'Not Started',
                    'H' => 'On Hold',
                    default => $project->status
                };

                // Convert single letter priority to full text
                $project->priority = match ($project->priority) {
                    'H' => 'High',
                    'M' => 'Medium',
                    'L' => 'Low',
                    default => $project->priority
                };

                // Add badge classes based on status
                $project->status_class = match (strtolower($project->status)) {
                    'completed' => 'bg-success-subtle text-success',
                    'in progress' => 'bg-warning-subtle text-warning',
                    'not started' => 'bg-danger-subtle text-danger',
                    'on hold' => 'bg-info-subtle text-info',
                    default => 'bg-secondary-subtle text-secondary'
                };

                // Add badge classes based on priority
                $project->priority_class = match (strtolower($project->priority)) {
                    'high' => 'bg-danger-subtle text-danger',
                    'medium' => 'bg-warning-subtle text-warning',
                    'low' => 'bg-success-subtle text-success',
                    default => 'bg-info-subtle text-info'
                };

                // Add these conversions
                $project->privacy = match ($project->privacy) {
                    'P' => 'Private',
                    'T' => 'Team',
                    'PU' => 'Public',
                    default => $project->privacy
                };

                // No need to convert category since it's already in full text

                // Add bookmark status
                $project->is_bookmarked = $project->bookmarks()
                    ->where('user_id', $userId)
                    ->exists();

                return $project;
            });

        // Get the success message and immediately forget it
        $success = session('success');
        session()->forget('success');

        return Inertia::render('apps/projects/list', [
            'projects' => $projects,
            'success' => $success,
            'filters' => [
                'search' => $search,
                'bookmarked' => $showBookmarked,
            ],
        ]);
    }

    // Add this method to your controller
    private function getPriorityColor($priority)
    {
        return match (strtolower($priority ?? '')) {
            'high' => 'danger',
            'medium' => 'warning',
            'low' => 'success',
            default => 'info'
        };
    }

    private function getProjectTeamMembers($project)
    {
        $members = [];

        // Get first team member as lead (if exists)
        if ($project->users->isNotEmpty()) {
            $firstMember = $project->users->first();
            $members[] = [
                'id' => 1,
                'imgNumber' => $firstMember->name[0] ?? '?',
                'bgColor' => 'primary'
            ];

            // Add remaining team members
            foreach ($project->users->skip(1) as $index => $member) {
                $members[] = [
                    'id' => $index + 2,
                    'imgTeam' => $member->profile_photo_url ?? null,
                    'imgNumber' => !$member->profile_photo_url ? ($member->name[0] ?? '?') : null,
                    'bgColor' => !$member->profile_photo_url ? 'secondary' : null
                ];
            }
        }

        // Add the "+" button
        $members[] = [
            'id' => count($members) + 1,
            'imgNumber' => '+',
        ];

        return $members;
    }

    public function destroy(Project $project)
    {
        // Check if the authenticated user is the creator of the project
        if ($project->user_id !== Auth::id()) {
            abort(403, 'You do not have permission to delete this project.');
        }

        try {
            Log::info('Starting project deletion', ['project_id' => $project->id]);

            // Begin transaction
            DB::beginTransaction();

            // Delete team member associations
            $project->users()->detach();
            Log::info('Team members detached');

            // Delete thumbnail if exists
            if ($project->thumbnail) {
                try {
                    Storage::disk('public')->delete($project->thumbnail);
                    Log::info('Thumbnail deleted', ['path' => $project->thumbnail]);
                } catch (\Exception $e) {
                    Log::warning('Failed to delete thumbnail', ['error' => $e->getMessage()]);
                }
            }

            // Delete attached files
            if (!empty($project->attached_files)) {
                try {
                    // No need to json_decode since it's already an array due to the cast
                    $files = $project->attached_files;
                    if (is_array($files)) {
                        foreach ($files as $file) {
                            if (isset($file['path'])) {
                                Storage::disk('public')->delete($file['path']);
                                Log::info('Attached file deleted', ['path' => $file['path']]);
                            }
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning('Failed to delete some attached files', ['error' => $e->getMessage()]);
                }
            }

            // Delete the project
            $project->delete();
            Log::info('Project deleted successfully');

            // Commit transaction
            DB::commit();

            if (request()->wantsJson()) {
                return response()->json(['message' => 'Project deleted successfully']);
            }

            return redirect()->route('projects.index')
                ->with('success', 'Project deleted successfully');
        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();

            Log::error('Failed to delete project', [
                'project_id' => $project->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Failed to delete project',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->withErrors(['error' => 'Failed to delete project: ' . $e->getMessage()]);
        }
    }

    public function edit(Project $project)
    {
        // Check if the authenticated user is the creator of the project
        if ($project->user_id !== Auth::id()) {
            abort(403, 'You do not have permission to edit this project.');
        }

        // Load the project with its relationships
        $project->load(['users']);

        // Transform the project data
        $project->team_members = $project->users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'profile_photo_path' => $user->profile_photo_path
            ];
        });

        // Handle skills - ensure it's an array
        if (is_string($project->skills)) {
            try {
                $project->skills = json_decode($project->skills, true) ?? [];
            } catch (\Exception $e) {
                $project->skills = [];
            }
        } elseif (!is_array($project->skills)) {
            $project->skills = [];
        }

        // Convert single letter codes to full text values
        $project->status = match ($project->status) {
            'C' => 'Completed',
            'I' => 'In Progress',
            'N' => 'Not Started',
            'H' => 'On Hold',
            default => $project->status
        };

        $project->priority = match ($project->priority) {
            'H' => 'High',
            'M' => 'Medium',
            'L' => 'Low',
            default => $project->priority
        };

        $project->privacy = match ($project->privacy) {
            'P' => 'Private',
            'T' => 'Team',
            'PU' => 'Public',
            default => $project->privacy
        };

        // Add full URL for thumbnail and attached files
        if ($project->thumbnail) {
            $project->thumbnail_url = URL::to(Storage::disk('public')->url($project->thumbnail));
        }

        // Handle attached files
        if ($project->attached_files) {
            $files = is_array($project->attached_files)
                ? $project->attached_files
                : (is_string($project->attached_files)
                    ? json_decode($project->attached_files, true)
                    : []);

            // Map the files with additional information
            $project->attached_files = array_map(function ($file) {
                // Ensure $file is an array and has 'path' key
                if (!is_array($file) || !isset($file['path'])) {
                    return null;
                }

                return [
                    'name' => $file['display_name'] ?? basename($file['path']), // Use display_name if available
                    'display_name' => $file['display_name'] ?? basename($file['path']), // Keep original name
                    'system_name' => basename($file['path']), // Store the full system filename
                    'path' => $file['path'],
                    'url' => URL::to(Storage::disk('public')->url($file['path'])),
                    'size' => $file['size'] ?? 0,
                    'type' => $file['type'] ?? 'application/octet-stream'
                ];
            }, $files);

            // Filter out any null values from the mapping
            $project->attached_files = array_values(array_filter($project->attached_files));
        } else {
            $project->attached_files = [];
        }

        return Inertia::render('apps/projects/create', [
            'project' => $project,
            'users' => User::select('id', 'name', 'email', 'profile_photo_path')->get(),
            'mode' => 'edit'
        ]);
    }

    public function update(Request $request, Project $project)
    {
        try {
            // Parse team members from JSON string to array before validation
            $data = $request->all();

            Log::info('Project update - Initial data:', [
                'project_id' => $project->id,
                'old_privacy' => $project->privacy,
                'new_privacy' => $data['privacy'],
                'team_members' => $data['team_members'] ?? [],
                'current_team' => $project->users()->pluck('users.id')
            ]);

            if (isset($data['team_members']) && is_string($data['team_members'])) {
                $data['team_members'] = json_decode($data['team_members'], true);
            }

            $validationRules = [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'priority' => 'required',
                'status' => 'required',
                'deadline' => 'required|date_format:Y-m-d',
                'privacy' => 'required',
                'skills' => 'required',
                'category' => 'required|string|in:Development,Designing',
                // Add validation for files
                'attached_files.*' => 'nullable|file|max:5120' // 5MB max per file
            ];

            // Only require team members and team lead if not private
            if ($data['privacy'] !== 'Private') {
                $validationRules['team_members'] = 'required|array';
                $validationRules['team_lead'] = 'required';
            }

            $validatedData = Validator::make($data, $validationRules)->validate();

            // Handle thumbnail updates
            if ($request->hasFile('thumbnail')) {
                // Delete old thumbnail if it exists and is not the default
                if ($project->thumbnail && !str_contains($project->thumbnail, 'sm-signal.png')) {
                    Storage::disk('public')->delete($project->thumbnail);
                }
                // Store new thumbnail
                $validatedData['thumbnail'] = $request->file('thumbnail')->store('project-thumbnails', 'public');
            }
            // If use_default_thumbnail is set, revert to default
            else if ($request->has('use_default_thumbnail')) {
                // Delete old thumbnail if it exists and is not the default
                if ($project->thumbnail && !str_contains($project->thumbnail, 'sm-signal.png')) {
                    Storage::disk('public')->delete($project->thumbnail);
                }
                $validatedData['thumbnail'] = null; // This will trigger the default thumbnail
            }

            // Handle new file attachments
            if ($request->hasFile('attached_files')) {
                $newFiles = [];
                foreach ($request->file('attached_files') as $file) {
                    $originalName = $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
                    $filename = $baseName . '_' . time() . '_' . uniqid() . '.' . $extension;

                    $path = $file->storeAs('project-files', $filename, 'public');

                    $newFiles[] = [
                        'path' => $path,
                        'name' => $originalName,
                        'display_name' => $originalName,
                        'system_name' => $filename,
                        'size' => $file->getSize(),
                        'type' => $file->getMimeType(),
                        'url' => URL::to(route('projects.download', ['filename' => basename($path)])),
                        'download_url' => URL::to(route('projects.download', ['filename' => basename($path)]))
                    ];
                }

                // Merge new files with existing files
                $existingFiles = is_array($project->attached_files) ? $project->attached_files : [];
                $validatedData['attached_files'] = array_merge($existingFiles, $newFiles);
            } else {
                // Keep existing files if no new files are uploaded
                $validatedData['attached_files'] = $project->attached_files;
            }

            // Convert privacy value
            $validatedData['privacy'] = match ($validatedData['privacy']) {
                'Private' => 'P',
                'Team' => 'T',
                'Public' => 'PU',
                default => $validatedData['privacy']
            };

            // Update project
            $project->update($validatedData);

            // Always sync team members, even if empty
            $teamMembers = !empty($validatedData['team_members']) ? $validatedData['team_members'] : [];
            $project->users()->sync($teamMembers);

            session()->flash('success', 'Project updated successfully');
            return Inertia::location(route('projects.index'));
        } catch (\Exception $e) {
            Log::error('Project update error:', [
                'message' => $e->getMessage(),
                'project_id' => $project->id,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    // Add this method to handle default thumbnail
    public function getThumbnailAttribute($value)
    {
        if ($value) {
            $path = Storage::disk('public')->path($value);
            return file_exists($path) ? $value : 'images/default-project.png';
        }
        return 'images/default-project.png';
    }

    public function downloadFile(Request $request, $filename)
    {
        try {
            $fullPath = 'project-files/' . $filename;

            Log::info('Download request:', [
                'filename' => $filename,
                'fullPath' => $fullPath
            ]);

            if (!Storage::disk('public')->exists($fullPath)) {
                Log::error('File not found in storage:', ['path' => $fullPath]);
                return response()->json([
                    'error' => 'File not found',
                    'message' => 'The requested file does not exist'
                ], 404);
            }

            // Get all projects and find the one containing our file
            $project = Project::all()->first(function ($project) use ($fullPath) {
                if (!is_array($project->attached_files)) {
                    return false;
                }
                return collect($project->attached_files)->contains('path', $fullPath);
            });

            if (!$project) {
                Log::error('Project search failed:', [
                    'path' => $fullPath,
                    'sample_projects' => Project::take(5)->get()->map(function ($p) {
                        return [
                            'id' => $p->id,
                            'files' => $p->attached_files
                        ];
                    })
                ]);
                return response()->json([
                    'error' => 'Project not found',
                    'message' => 'No project associated with this file'
                ], 404);
            }

            // Get the file metadata
            $fileMetadata = collect($project->attached_files)->firstWhere('path', $fullPath);

            Log::info('Found file metadata:', [
                'project_id' => $project->id,
                'metadata' => $fileMetadata
            ]);

            if (!$fileMetadata) {
                Log::error('File metadata not found:', [
                    'path' => $fullPath,
                    'project_files' => $project->attached_files
                ]);
                return response()->json([
                    'error' => 'File metadata not found',
                    'message' => 'File metadata is missing'
                ], 404);
            }

            $file = Storage::disk('public')->path($fullPath);

            return response()->download(
                $file,
                $fileMetadata['name'],
                [
                    'Content-Type' => $fileMetadata['type'],
                    'Content-Disposition' => $request->has('download')
                        ? 'attachment; filename="' . $fileMetadata['name'] . '"'
                        : 'inline; filename="' . $fileMetadata['name'] . '"'
                ]
            );
        } catch (\Exception $e) {
            Log::error('Download error:', [
                'message' => $e->getMessage(),
                'filename' => $filename,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Download failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteFile(Project $project, $filename)
    {
        try {
            $attachedFiles = collect($project->attached_files);
            $fileToDelete = $attachedFiles->firstWhere('name', $filename);

            if (!$fileToDelete) {
                return back()->with('error', 'File not found in project');
            }

            $fullPath = $fileToDelete['path'];

            // Remove file from storage
            if (Storage::disk('public')->exists($fullPath)) {
                Storage::disk('public')->delete($fullPath);
            }

            // Remove file from project's attached_files array
            $updatedFiles = $attachedFiles->reject(function ($file) use ($fullPath) {
                return $file['path'] === $fullPath;
            })->values()->all();

            // Update project
            $project->attached_files = $updatedFiles;
            $project->save();

            return back()->with('success', 'File deleted successfully');
        } catch (\Exception $e) {
            Log::error('File deletion error:', [
                'message' => $e->getMessage(),
                'project_id' => $project->id,
                'filename' => $filename,
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to delete file');
        }
    }

    public function show(Project $project)
    {
        // Check if user can access this project
        if (!$project->canBeAccessedBy(Auth::user())) {
            abort(403, 'You do not have permission to view this project.');
        }

        $project->load([
            'users',
            'comments.user',
            'comments.replies.user'
        ]);

        // Parse skills from JSON if it's a string
        if (is_string($project->skills)) {
            $project->skills = json_decode($project->skills, true);
        }
        // If skills is a string like "HTML,CSS,JavaScript", convert to array
        elseif (is_string($project->skills)) {
            $project->skills = explode(',', $project->skills);
        }
        // Ensure skills is always an array
        if (!is_array($project->skills)) {
            $project->skills = [];
        }

        // Convert status and priority to full text
        $project->status = match ($project->status) {
            'C' => 'Completed',
            'I' => 'In Progress',
            'N' => 'Not Started',
            'H' => 'On Hold',
            default => $project->status
        };

        $project->priority = match ($project->priority) {
            'H' => 'High',
            'M' => 'Medium',
            'L' => 'Low',
            default => $project->priority
        };

        // Add privacy and category conversions
        $project->privacy = match ($project->privacy) {
            'P' => 'Private',
            'T' => 'Team',
            'PU' => 'Public',
            default => $project->privacy
        };

        // Add status and priority classes
        $project->status_class = match (strtolower($project->status)) {
            'completed' => 'bg-success-subtle text-success',
            'in progress' => 'bg-warning-subtle text-warning',
            'not started' => 'bg-danger-subtle text-danger',
            'on hold' => 'bg-info-subtle text-info',
            default => 'bg-secondary-subtle text-secondary'
        };

        $project->priority_class = match (strtolower($project->priority)) {
            'high' => 'bg-danger-subtle text-danger',
            'medium' => 'bg-warning-subtle text-warning',
            'low' => 'bg-success-subtle text-success',
            default => 'bg-info-subtle text-info'
        };

        return Inertia::render('apps/projects/overview', [
            'project' => $project
        ]);
    }

    public function uploadFiles(Request $request, Project $project)
    {
        try {
            $request->validate([
                'attached_files.*' => 'required|file|mimetypes:image/jpeg,image/png,image/jpg,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/html|max:5120'
            ]);

            $files = [];
            $currentFiles = collect($project->attached_files ?? []);

            if ($request->hasFile('attached_files')) {
                foreach ($request->file('attached_files') as $file) {
                    $originalName = $file->getClientOriginalName();
                    // Get file extension
                    $extension = $file->getClientOriginalExtension();
                    // Create a sanitized base name
                    $baseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
                    // Create unique filename while preserving original name
                    $filename = $baseName . '_' . time() . '_' . uniqid() . '.' . $extension;

                    $path = $file->storeAs('project-files', $filename, 'public');
                    $files[] = [
                        'path' => $path,
                        'name' => $originalName,
                        'display_name' => $originalName,
                        'system_name' => $filename,
                        'size' => $file->getSize(),
                        'type' => $file->getMimeType(),
                        'url' => URL::to(route('projects.download', ['filename' => basename($path)])),
                        'download_url' => URL::to(route('projects.download', ['filename' => basename($path)]))
                    ];
                }

                // Merge new files with existing files
                $project->attached_files = array_merge($currentFiles->toArray(), $files);
                $project->save();

                return back()->with('success', 'Files uploaded successfully');
            }

            return back()->with('error', 'No files were uploaded');
        } catch (\Exception $e) {
            Log::error('File upload error:', [
                'message' => $e->getMessage(),
                'project_id' => $project->id,
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to upload files: ' . $e->getMessage());
        }
    }

    public function toggleBookmark(Project $project)
    {
        $user = Auth::user();

        if ($project->bookmarks()->where('user_id', $user->id)->exists()) {
            $project->bookmarks()->detach($user->id);
            $bookmarked = false;
        } else {
            $project->bookmarks()->attach($user->id);
            $bookmarked = true;
        }

        return response()->json([
            'bookmarked' => $bookmarked
        ]);
    }

    // Add these helper methods for converting status and priority
    private function convertStatus($status)
    {
        return match ($status) {
            'Completed' => 'C',
            'In Progress' => 'I',
            'Not Started' => 'N',
            'On Hold' => 'H',
            default => $status
        };
    }

    private function convertPriority($priority)
    {
        return match ($priority) {
            'High' => 'H',
            'Medium' => 'M',
            'Low' => 'L',
            default => $priority
        };
    }
}
