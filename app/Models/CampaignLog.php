<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CampaignLog extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'timestamp', // scheduled time for the event
        'campaign_id',
        'event_type'
    ];

    protected $casts = [
        'timestamp' => 'datetime:Y-m-d H:i:s',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s'
    ];

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // For schedule.vue display
    public function getScheduleData()
    {
        $scheduledTime = Carbon::parse($this->timestamp)
            ->setTimezone(config('app.timezone'));

        return [
            'date' => $scheduledTime->format('d'),
            'title' => $this->title,
            'company' => $this->description,
            'time' => $scheduledTime->format('g:i'),
            'period' => strtolower($scheduledTime->format('A')),
            'status' => $this->status
        ];
    }

    // For campaign-logs.vue display
    public function getLogData()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'event_type' => $this->event_type,
            'timestamp' => Carbon::parse($this->timestamp)
                ->setTimezone(config('app.timezone'))
                ->format('Y-m-d h:i A'),
            'created_at' => Carbon::parse($this->created_at)
                ->setTimezone(config('app.timezone'))
                ->format('Y-m-d g:i A'),
            'icon_class' => $this->getIconClass()
        ];
    }

    public function getIconClass()
    {
        return match ($this->event_type) {
            'ab_test' => 'ri-test-tube-line',
            'campaign_launch' => 'ri-rocket-line',
            'subject_test' => 'ri-mail-line',
            'automation' => 'ri-settings-3-line',
            default => 'ri-calendar-line'
        };
    }
}
