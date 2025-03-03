<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CampaignPerformance extends Model
{
    protected $fillable = [
        'campaign_name',
        'date',
        'emails_sent',
        'emails_delivered',
        'emails_opened',
        'clicks',
        'visitors',
        'entries',
        'leads',
        'conversions',
        'delivery_rate',
        'open_rate',
        'click_through_rate',
        'conversion_rate',
        'lead_conversion_rate',
        'source',
        'additional_metrics'
    ];

    protected $casts = [
        'date' => 'date',
        'additional_metrics' => 'array',
        'delivery_rate' => 'float',
        'open_rate' => 'float',
        'click_through_rate' => 'float',
        'conversion_rate' => 'float',
        'lead_conversion_rate' => 'float'
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            // Calculate rates before saving
            if ($model->emails_sent > 0) {
                $model->delivery_rate = ($model->emails_delivered / $model->emails_sent) * 100;
                $model->open_rate = ($model->emails_opened / $model->emails_delivered) * 100;
                $model->click_through_rate = ($model->clicks / $model->emails_opened) * 100;
            }

            if ($model->visitors > 0) {
                $model->conversion_rate = ($model->conversions / $model->visitors) * 100;
            }

            if ($model->leads > 0) {
                $model->lead_conversion_rate = ($model->conversions / $model->leads) * 100;
            }
        });
    }

    public function scopeForPeriod($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    public function scopeForCampaign($query, $campaignName)
    {
        return $query->where('campaign_name', $campaignName);
    }

    public static function getComparison($campaignName, $period = 'month', $customStart = null, $customEnd = null)
    {
        $endDate = $customEnd ? Carbon::parse($customEnd) : Carbon::now();

        if ($period === 'custom' && $customStart && $customEnd) {
            $startDate = Carbon::parse($customStart);
        } else {
            $startDate = match ($period) {
                'day' => Carbon::now()->subDays(1),
                'month' => Carbon::now()->subMonths(1),
                'year' => Carbon::now()->subYears(1),
                default => Carbon::now()->subMonths(1)
            };
        }

        Log::info('Fetching campaign data', [
            'campaign' => $campaignName,
            'period' => $period,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'customStart' => $customStart,
            'customEnd' => $customEnd
        ]);

        $currentPeriodData = self::forCampaign($campaignName)
            ->forPeriod($startDate, $endDate)
            ->orderBy('date')
            ->get();

        // Calculate previous period dates based on the duration between start and end dates
        $periodDuration = $startDate->diffInDays($endDate);
        $previousPeriodEnd = $startDate->copy()->subDay();
        $previousPeriodStart = $previousPeriodEnd->copy()->subDays($periodDuration);

        $previousPeriodData = self::forCampaign($campaignName)
            ->forPeriod($previousPeriodStart, $previousPeriodEnd)
            ->orderBy('date')
            ->get();

        return [
            'currentPeriod' => $currentPeriodData,
            'previousPeriod' => $previousPeriodData,
            'metrics' => [
                'current' => self::calculatePeriodMetrics($currentPeriodData),
                'previous' => self::calculatePeriodMetrics($previousPeriodData)
            ]
        ];
    }

    private static function calculatePeriodMetrics($data)
    {
        return [
            'totals' => [
                'emails_sent' => $data->sum('emails_sent'),
                'emails_delivered' => $data->sum('emails_delivered'),
                'emails_opened' => $data->sum('emails_opened'),
                'clicks' => $data->sum('clicks'),
                'visitors' => $data->sum('visitors'),
                'entries' => $data->sum('entries'),
                'leads' => $data->sum('leads'),
                'conversions' => $data->sum('conversions'),
            ],
            'rates' => [
                'delivery_rate' => $data->avg('delivery_rate'),
                'open_rate' => $data->avg('open_rate'),
                'click_through_rate' => $data->avg('click_through_rate'),
                'conversion_rate' => $data->avg('conversion_rate'),
                'lead_conversion_rate' => $data->avg('lead_conversion_rate'),
            ]
        ];
    }
}
