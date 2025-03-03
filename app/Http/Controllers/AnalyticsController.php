<?php

namespace App\Http\Controllers;

use App\Models\CampaignPerformance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function getCampaignData(Request $request)
    {
        $request->validate([
            'campaign' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);

        $data = CampaignPerformance::forCampaign($request->campaign)
            ->forPeriod(
                Carbon::parse($request->start_date),
                Carbon::parse($request->end_date)
            )
            ->orderBy('date')
            ->get();

        return response()->json([
            'campaign' => $request->campaign,
            'period' => [
                'start' => $request->start_date,
                'end' => $request->end_date
            ],
            'data' => $data,
            'metrics' => CampaignPerformance::calculatePeriodMetrics($data)
        ]);
    }

    public function downloadData(Request $request)
    {
        $request->validate([
            'campaigns' => 'required|string',
            'period' => 'required|string|in:mtd,3m,custom',
            'start_date' => 'required_if:period,custom|date',
            'end_date' => 'required_if:period,custom|date|after_or_equal:start_date'
        ]);

        $campaigns = explode(',', $request->campaigns);

        // Calculate date range based on period
        $endDate = now();
        $startDate = match ($request->period) {
            'mtd' => now()->startOfMonth(),
            '3m' => now()->subMonths(3),
            'custom' => Carbon::parse($request->start_date),
            default => now()->subMonth()
        };

        if ($request->period === 'custom') {
            $endDate = Carbon::parse($request->end_date);
        }

        $data = CampaignPerformance::whereIn('campaign_name', $campaigns)
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('campaign_name')
            ->orderBy('date')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="campaign-data-' . now()->format('Y-m-d') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');

            // Add headers
            fputcsv($file, [
                'Campaign',
                'Date',
                'Emails Sent',
                'Emails Delivered',
                'Emails Opened',
                'Clicks',
                'Visitors',
                'Entries',
                'Leads',
                'Conversions',
                'Delivery Rate',
                'Open Rate',
                'Click Through Rate',
                'Conversion Rate',
                'Lead Conversion Rate'
            ]);

            // Add data
            foreach ($data as $row) {
                fputcsv($file, [
                    $row->campaign_name,
                    $row->date->format('Y-m-d'),
                    $row->emails_sent,
                    $row->emails_delivered,
                    $row->emails_opened,
                    $row->clicks,
                    $row->visitors,
                    $row->entries,
                    $row->leads,
                    $row->conversions,
                    number_format($row->delivery_rate, 2) . '%',
                    number_format($row->open_rate, 2) . '%',
                    number_format($row->click_through_rate, 2) . '%',
                    number_format($row->conversion_rate, 2) . '%',
                    number_format($row->lead_conversion_rate, 2) . '%'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
