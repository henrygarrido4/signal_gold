<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'task_id',
        'title',
        'description',
        'project_id',
        'creator_id',
        'due_date',
        'priority',
        'status',
        'order'
    ];

    protected $casts = [
        'due_date' => 'date'
    ];

    public function project()
    {
        return $this->belongsTo(TodoProject::class, 'project_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function assignedUsers()
    {
        return $this->belongsToMany(User::class, 'task_user')
            ->withTimestamps();
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($task) {
            $task->task_id = 'TASK-' . str_pad(random_int(1, 99999), 5, '0', STR_PAD_LEFT);
        });
    }
}
