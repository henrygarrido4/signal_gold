<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlowEmail extends Model
{
    protected $fillable = [
        'name',
        'subject',
        'delay',
        'image_path',
        'flow_id',
        'order',
        'workflow_name',
        'workflow_url',
        'campaign_id',
        'email_link',
        'send_list',
        'suppression_lists',
        'description'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($email) {
            // Get max order for this flow
            $maxOrder = static::where('flow_id', $email->flow_id)->max('order');
            $email->order = is_null($maxOrder) ? 0 : $maxOrder + 1;
        });
    }

    public function flow()
    {
        return $this->belongsTo(Flow::class);
    }
}
