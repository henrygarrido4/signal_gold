<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'priority',
        'status',
        'deadline',
        'privacy',
        'category',
        'thumbnail',
        'skills',
        'team_lead',
        'team_members',
        'attached_files',
        'user_id',
    ];

    protected $casts = [
        'skills' => 'array',
        'attached_files' => 'array',
        'team_members' => 'array'
    ];

    protected $appends = ['thumbnail_url'];

    // Update the relationship name
    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    // Scope to get all visible projects
    public function scopeVisible($query)
    {
        return $query->where(function ($q) {
            $q->where('privacy', 'public')
                ->orWhereNull('privacy')
                ->orWhereHas('users', function ($q) {
                    $q->where('user_id', auth()->id());
                });
        });
    }

    public function getThumbnailUrlAttribute()
    {
        if ($this->thumbnail) {
            $path = Storage::disk('public')->path($this->thumbnail);
            return file_exists($path)
                ? Storage::disk('public')->url($this->thumbnail)
                : asset('images/sm-signal.png');
        }
        return asset('images/sm-signal.png');
    }

    // Simple date mutator
    public function setDeadlineAttribute($value)
    {
        $this->attributes['deadline'] = $value;
    }

    // Simple date accessor
    public function getDeadlineAttribute($value)
    {
        return $value;
    }

    // Add relationship to creator
    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Helper method to check if user can access project
    public function canBeAccessedBy(User $user)
    {
        return $this->privacy === 'PU' || // Public projects
            $this->user_id === $user->id || // Created by user
            ($this->privacy === 'T' && $this->users->contains($user->id)); // Team member
    }

    // Add this relationship to your existing Project model
    public function comments()
    {
        return $this->hasMany(ProjectComment::class)
            ->whereNull('parent_id')
            ->orderBy('created_at', 'desc');
    }

    // Add the bookmarks relationship
    public function bookmarks()
    {
        return $this->belongsToMany(User::class, 'project_bookmarks')->withTimestamps();
    }

    // Add helper method to check bookmark status
    public function isBookmarkedBy(User $user)
    {
        return $this->bookmarks()->where('user_id', $user->id)->exists();
    }
}
