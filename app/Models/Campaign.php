<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    protected $fillable = [
        'name',
        'group',
        'status',
        'description'
    ];

    public function snapshots()
    {
        return $this->hasMany(CampaignSnapshot::class);
    }
}
