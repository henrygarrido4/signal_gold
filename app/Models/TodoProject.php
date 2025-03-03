<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TodoProject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'creator_id'];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($project) {
            $project->tasks()->delete();
        });
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }
}
