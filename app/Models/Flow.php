<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flow extends Model
{
    protected $fillable = [
        'name',
        'description',
        'status'
    ];

    public function emails()
    {
        return $this->hasMany(FlowEmail::class)->orderBy('order', 'asc');
    }
}
