<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CampaignSnapshot;
use App\Models\Campaign;

class CampaignPerformanceSeeder extends Seeder
{
    public function run()
    {
        // Create the campaign first
        $campaign = Campaign::firstOrCreate(
            ['name' => 'tr_savedcar_confirmation_eml'],
            [
                'group' => 'TR',
                'description' => 'TR Saved Car Confirmation Email Campaign'
            ]
        );

        // Create snapshots for each month
        $months = ['December', 'January', 'February'];
        foreach ($months as $month) {
            $snapshot = CampaignSnapshot::create([
                'name' => "TR Saved Car Confirmation - $month Performance",
                'period_type' => 'daily',
                'campaign_id' => $campaign->id,
                'metrics_data' => $this->getMonthData($month),
                'notes' => "Daily performance data for $month"
            ]);
        }
    }

    private function getMonthData($month)
    {
        $data = [];

        // January data
        if ($month === 'January') {
            for ($day = 1; $day <= 31; $day++) {
                $data[$day] = match ($day) {
                    1 => [
                        'emails_sent' => 29794,
                        'emails_delivered' => 29563,
                        'delivery_rate' => 99.2,
                        'unique_opens' => 6676,
                        'open_rate' => 22.6,
                        'total_clicks' => 1664,
                        'click_to_open_rate' => 12.7,
                        'click_rate' => 5.63,
                        'unsubscribes' => 15,
                        'unsubscribe_rate' => 0.1,
                        'entries' => 1028,
                        'dealer_leads' => 54,
                        'total_leads' => 55,
                        'conversion_rate' => 5.35
                    ],
                    2 => [
                        'emails_sent' => 37342,
                        'emails_delivered' => 37113,
                        'delivery_rate' => 99.4,
                        'unique_opens' => 8162,
                        'open_rate' => 22.0,
                        'total_clicks' => 1816,
                        'click_to_open_rate' => 11.6,
                        'click_rate' => 4.89,
                        'unsubscribes' => 6,
                        'unsubscribe_rate' => 0.0,
                        'entries' => 1273,
                        'dealer_leads' => 133,
                        'total_leads' => 138,
                        'conversion_rate' => 10.83
                    ],
                        // Add remaining January days here...
                    default => null
                };
            }
        }

        // February data
        else if ($month === 'February') {
            for ($day = 1; $day <= 17; $day++) {
                $data[$day] = match ($day) {
                    1 => [
                        'emails_sent' => 38398,
                        'emails_delivered' => 38203,
                        'delivery_rate' => 99.5,
                        'unique_opens' => 8099,
                        'open_rate' => 21.2,
                        'total_clicks' => 1765,
                        'click_to_open_rate' => 12.1,
                        'click_rate' => 4.62,
                        'unsubscribes' => 12,
                        'unsubscribe_rate' => 0.0,
                        'entries' => 1252,
                        'dealer_leads' => 109,
                        'total_leads' => 113,
                        'conversion_rate' => 9.03
                    ],
                        // Add remaining February days here...
                    default => null
                };
            }
        }

        // December data
        else if ($month === 'December') {
            for ($day = 1; $day <= 31; $day++) {
                $data[$day] = match ($day) {
                    1 => [
                        'emails_sent' => 30733,
                        'emails_delivered' => 30600,
                        'delivery_rate' => 99.6,
                        'unique_opens' => 6565,
                        'open_rate' => 21.5,
                        'total_clicks' => 1387,
                        'click_to_open_rate' => 11.2,
                        'click_rate' => 4.53,
                        'unsubscribes' => 11,
                        'unsubscribe_rate' => 0.0,
                        'entries' => 1040,
                        'dealer_leads' => 86,
                        'total_leads' => 89,
                        'conversion_rate' => 8.52
                    ],
                        // Add remaining December days here...
                    default => null
                };
            }
        }

        // Remove any null entries
        return array_filter($data);
    }
}
