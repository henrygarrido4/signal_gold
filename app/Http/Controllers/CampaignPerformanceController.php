<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignPerformance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class CampaignPerformanceController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'campaign_name' => 'required|string',
            'date' => 'required|date',
            'emails_sent' => 'required|integer',
            'emails_delivered' => 'required|integer',
            'emails_opened' => 'required|integer',
            'clicks' => 'required|integer',
            'visitors' => 'required|integer',
            'entries' => 'required|integer',
            'leads' => 'required|integer',
            'conversions' => 'required|integer',
            'source' => 'required|in:crm,analytics',
            'additional_metrics' => 'nullable|array'
        ]);

        // Rates are automatically calculated in the model's boot method
        CampaignPerformance::create($validated);

        return response()->json(['message' => 'Performance data saved successfully']);
    }

    public function show(Request $request, $campaignName)
    {
        $period = $request->input('period', 'month');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $data = CampaignPerformance::getComparison(
            $campaignName,
            $period,
            $startDate,
            $endDate
        );

        return response()->json($data);
    }

    public function download(Request $request)
    {
        $campaignName = $request->input('campaign');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = CampaignPerformance::query();

        if ($campaignName) {
            $query->forCampaign($campaignName);
        }

        if ($startDate && $endDate && $startDate !== 'null' && $endDate !== 'null') {
            $query->forPeriod($startDate, $endDate);
        }

        $data = $query->orderBy('date')->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="campaign-performance.csv"',
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'Campaign',
                'Date',
                'Emails Sent',
                'Delivered',
                'Opened',
                'Clicks',
                'Visitors',
                'Entries',
                'Leads',
                'Conversions',
                'Delivery Rate',
                'Open Rate',
                'CTR',
                'Conversion Rate',
                'Lead Conv. Rate',
                'Source'
            ]);

            foreach ($data as $record) {
                fputcsv($file, [
                    $record->campaign_name,
                    $record->date->format('Y-m-d'),
                    $record->emails_sent,
                    $record->emails_delivered,
                    $record->emails_opened,
                    $record->clicks,
                    $record->visitors,
                    $record->entries,
                    $record->leads,
                    $record->conversions,
                    number_format($record->delivery_rate, 2) . '%',
                    number_format($record->open_rate, 2) . '%',
                    number_format($record->click_through_rate, 2) . '%',
                    number_format($record->conversion_rate, 2) . '%',
                    number_format($record->lead_conversion_rate, 2) . '%',
                    $record->source
                ]);
            }
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Fetch campaign performance data based on filters.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'campaign_names' => 'array',
            'campaign_names.*' => 'string|exists:campaigns,name',
            'start_date' => 'date|nullable',
            'end_date' => 'date|nullable|after_or_equal:start_date',
        ]);

        $query = CampaignPerformance::query();

        if ($request->has('campaign_names')) {
            $query->whereIn('campaign_name', $validated['campaign_names']);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('date', [$validated['start_date'], $validated['end_date']]);
        }

        $data = $query->orderBy('date')->get();

        return response()->json($data);
    }
}
