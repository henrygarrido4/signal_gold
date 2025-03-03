<?php

namespace Database\Seeders;

use App\Models\Flow;
use Illuminate\Database\Seeder;

class FlowSeeder extends Seeder
{
    public function run()
    {
        $flows = [
            [
                'name' => 'Welcome Series',
                'description' => 'Onboarding flow for new subscribers',
                'status' => 'active',
                'emails' => [
                    [
                        'name' => 'Welcome Email',
                        'subject' => 'Welcome to our family!',
                        'delay' => 'Immediately',
                        'image_path' => null
                    ],
                    [
                        'name' => 'Product Introduction',
                        'subject' => 'Discover what we offer',
                        'delay' => '2 days after',
                        'image_path' => null
                    ]
                ]
            ],
            [
                'name' => 'Abandoned Cart',
                'description' => 'Follow up with customers who left items in cart',
                'status' => 'active',
                'emails' => [
                    [
                        'name' => 'Cart Reminder',
                        'subject' => 'Did you forget something?',
                        'delay' => '6 hours after',
                        'image_path' => null
                    ]
                ]
            ],
            [
                'name' => 'Re-engagement',
                'description' => 'Win back inactive subscribers',
                'status' => 'draft',
                'emails' => [
                    [
                        'name' => 'We Miss You',
                        'subject' => 'It\'s been a while...',
                        'delay' => 'Immediately',
                        'image_path' => null
                    ],
                    [
                        'name' => 'Special Offer',
                        'subject' => 'Here\'s a special discount just for you',
                        'delay' => '3 days after',
                        'image_path' => null
                    ]
                ]
            ]
        ];

        foreach ($flows as $flowData) {
            $emails = $flowData['emails'];
            unset($flowData['emails']);
            
            $flow = Flow::create($flowData);
            $flow->emails()->createMany($emails);
        }
    }
}
