<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignSnapshot extends Model
{
    protected $fillable = [
        'name',
        'campaign_id',
        'period_type',
        'metrics_data',
        'notes',
    ];

    protected $casts = [
        'metrics_data' => 'array',
        'campaign_id' => 'string',
    ];

    /**
     * If snapshots are associated with multiple campaigns.
     */
    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function addPeriodData($periodKey, $metrics)
    {
        $currentData = $this->metrics_data ?? [];
        $currentData[$periodKey] = $metrics;
        $this->metrics_data = $currentData;
        $this->save();
    }

    public function getComparison($type = 'wow')
    {
        $data = $this->metrics_data;
        $periods = array_keys($data);
        sort($periods);

        $results = [];
        for ($i = 1; $i < count($periods); $i++) {
            $current = $data[$periods[$i]];
            $previous = $data[$periods[$i - 1]];

            $results[$periods[$i]] = [
                'metrics' => $current,
                'changes' => $this->calculateChanges($current, $previous)
            ];
        }

        return $results;
    }

    private function calculateChanges($current, $previous)
    {
        $changes = [];
        foreach ($current as $key => $value) {
            if (is_numeric($value) && isset($previous[$key])) {
                $percentChange = $previous[$key] != 0
                    ? (($value - $previous[$key]) / $previous[$key]) * 100
                    : 0;
                $changes[$key] = round($percentChange, 2);
            }
        }
        return $changes;
    }
}
