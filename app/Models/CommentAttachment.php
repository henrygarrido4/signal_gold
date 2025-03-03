<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CommentAttachment extends Model
{
    protected $fillable = [
        'project_comment_id',
        'name',
        'path',
        'type',
        'size'
    ];

    protected $appends = ['url'];

    public function comment(): BelongsTo
    {
        return $this->belongsTo(ProjectComment::class, 'project_comment_id');
    }

    public function getUrlAttribute()
    {
        return Storage::disk('public')->url($this->path);
    }
}
