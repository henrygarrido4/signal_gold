<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class CampaignSnapshotsExport implements FromArray, WithHeadings, ShouldAutoSize
{
    protected $snapshots;

    public function __construct($snapshots)
    {
        $this->snapshots = $snapshots;
    }

    public function array(): array
    {
        return collect($this->snapshots)->map(function ($snapshot) {
            return [
                'Campaign Name' => $snapshot['campaign_name'],
                'Period Type' => $snapshot['period_type'],
                'Emails Sent' => $snapshot['metrics']['emails_sent'],
                'Clicks' => $snapshot['metrics']['clicks'],
                'Click Rate' => $snapshot['metrics']['click_rate'] . '%',
                'Entries' => $snapshot['metrics']['entries'],
                'Leads' => $snapshot['metrics']['leads'],
                'Conversion Rate' => $snapshot['metrics']['conversion_rate'] . '%',
                'Date Saved' => $snapshot['created_at'],
            ];
        })->toArray();
    }

    public function headings(): array
    {
        return [
            'Campaign Name',
            'Period Type',
            'Emails Sent',
            'Clicks',
            'Click Rate',
            'Entries',
            'Leads',
            'Conversion Rate',
            'Date Saved'
        ];
    }
}
