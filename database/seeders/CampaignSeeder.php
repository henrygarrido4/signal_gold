<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\CampaignSnapshot;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    public function run()
    {
        // Create some campaigns
        $campaigns = [
            [
                'name' => 'Summer Sale 2024',
                'status' => 'active',
                'description' => 'Summer promotional campaign'
            ],
            [
                'name' => 'New Customer Welcome',
                'status' => 'active',
                'description' => 'Welcome series for new customers'
            ],
            [
                'name' => 'Product Launch',
                'status' => 'active',
                'description' => 'New product announcement campaign'
            ],
        ];

        foreach ($campaigns as $campaign) {
            $campaignModel = Campaign::create($campaign);

            // Create snapshots for each campaign
            $snapshots = [
                [
                    'name' => 'Week 1 Performance',
                    'period_type' => 'weekly',
                    'metrics_data' => [
                        'current' => [
                            'totals' => [
                                'emails_sent' => rand(5000, 10000),
                                'emails_delivered' => rand(4500, 9000),
                                'emails_opened' => rand(2000, 4000),
                                'clicks' => rand(500, 2000),
                                'visitors' => rand(400, 1500),
                                'entries' => rand(200, 800),
                                'leads' => rand(50, 200),
                                'conversions' => rand(20, 100)
                            ],
                            'rates' => [
                                'delivery_rate' => rand(90, 98),
                                'open_rate' => rand(20, 40),
                                'click_through_rate' => rand(10, 30),
                                'conversion_rate' => rand(2, 10),
                                'lead_conversion_rate' => rand(5, 15)
                            ]
                        ]
                    ],
                    'notes' => 'Initial campaign performance'
                ],
                [
                    'name' => 'Mid-Campaign Review',
                    'period_type' => 'weekly',
                    'metrics_data' => [
                        'current' => [
                            'totals' => [
                                'emails_sent' => rand(5000, 10000),
                                'emails_delivered' => rand(4500, 9000),
                                'emails_opened' => rand(2000, 4000),
                                'clicks' => rand(500, 2000),
                                'visitors' => rand(400, 1500),
                                'entries' => rand(200, 800),
                                'leads' => rand(50, 200),
                                'conversions' => rand(20, 100)
                            ],
                            'rates' => [
                                'delivery_rate' => rand(90, 98),
                                'open_rate' => rand(20, 40),
                                'click_through_rate' => rand(10, 30),
                                'conversion_rate' => rand(2, 10),
                                'lead_conversion_rate' => rand(5, 15)
                            ]
                        ]
                    ],
                    'notes' => 'Mid-campaign performance analysis'
                ]
            ];

            foreach ($snapshots as $snapshot) {
                $snapshot['campaign_id'] = $campaignModel->id;
                CampaignSnapshot::create($snapshot);
            }
        }

        $campaign = Campaign::create([
            'name' => 'Test Campaign',
            'description' => 'Test campaign for development'
        ]);

        // Create a snapshot with proper JSON encoding for metrics
        CampaignSnapshot::create([
            'name' => 'Week 1 Performance',
            'campaign_id' => $campaign->id,
            'period_type' => 'weekly',
            'metrics_data' => json_encode([
                'emails_sent' => 10000,
                'emails_delivered' => 9800,
                'delivery_rate' => 98.0,
                'unique_opens' => 3500,
                'open_rate' => 35.7,
                'total_clicks' => 850,
                'click_to_open_rate' => 24.3,
                'click_rate' => 8.67,
                'unsubscribes' => 15,
                'unsubscribe_rate' => 0.15,
                'entries' => 450,
                'dealer_leads' => 120,
                'total_leads' => 125,
                'conversion_rate' => 27.8
            ]),
            'notes' => 'Initial campaign performance'
        ]);
    }
}
