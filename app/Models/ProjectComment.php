<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectComment extends Model
{
    protected $fillable = [
        'project_id',
        'user_id',
        'content',
        'parent_id'
    ];

    protected $with = ['user', 'replies', 'attachments', 'project'];

    // Relationship to the project
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    // Relationship to the user who made the comment
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relationship to parent comment (if this is a reply)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(ProjectComment::class, 'parent_id');
    }

    // Relationship to replies (child comments)
    public function replies(): HasMany
    {
        return $this->hasMany(ProjectComment::class, 'parent_id')->orderBy('created_at', 'desc');
    }

    // Add this relationship
    public function attachments()
    {
        return $this->hasMany(CommentAttachment::class);
    }
}
