<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignSnapshot;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CampaignSnapshotsExport;

class CampaignSnapshotController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboards/crm/campaign-snapshots', [
            'campaigns' => Campaign::all(),
            'snapshots' => CampaignSnapshot::with('campaign')
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'campaign_id' => 'required|string',
            'period_type' => 'required|string|in:daily,weekly,monthly,quarterly,yearly',
            'metrics_data' => 'required|array',
            'notes' => 'nullable|string'
        ]);

        $snapshot = CampaignSnapshot::create($validated);

        if ($request->wantsJson()) {
            return response()->json($snapshot->load('campaign'));
        }

        return redirect()->back()->with('success', 'Snapshot created successfully');
    }

    public function destroy($id)
    {
        $snapshot = CampaignSnapshot::findOrFail($id);
        $snapshot->delete();

        return redirect()->back()->with('success', 'Snapshot deleted successfully');
    }

    public function addData(CampaignSnapshot $snapshot, Request $request)
    {
        $validated = $request->validate([
            'data_type' => 'required|in:campaign,analytics',
            'metrics' => 'required|array'
        ]);

        // Merge new data with existing metrics
        $metrics = $snapshot->metrics;
        $metrics[$validated['data_type']][] = $validated['metrics'];

        $snapshot->update([
            'metrics' => $metrics
        ]);

        return response()->json(['message' => 'Data added successfully']);
    }

    public function export(Request $request)
    {
        $snapshots = $request->snapshots;
        return Excel::download(
            new CampaignSnapshotsExport($snapshots),
            'campaign-snapshots-' . now()->format('Y-m-d-His') . '.xlsx'
        );
    }

    public function addPeriodData(Request $request, CampaignSnapshot $snapshot)
    {
        $validated = $request->validate([
            'period_key' => 'required|string', // e.g., "2024-01", "2024-Q1", "2024"
            'metrics' => 'required|array',
            'metrics.emails_sent' => 'required|numeric',
            'metrics.emails_opened' => 'required|numeric',
            'metrics.clicks' => 'required|numeric',
            'metrics.entries' => 'required|numeric',
            'metrics.leads' => 'required|numeric',
            'metrics.click_rate' => 'required|numeric',
            'metrics.conversion_rate' => 'required|numeric',
        ]);

        $snapshot->addPeriodData($validated['period_key'], $validated['metrics']);

        return response()->json([
            'message' => 'Period data added successfully',
            'snapshot' => $snapshot->fresh()
        ]);
    }

    public function getComparison(CampaignSnapshot $snapshot, Request $request)
    {
        $type = $request->input('type', 'wow'); // wow, mom, yoy
        return response()->json([
            'comparison' => $snapshot->getComparison($type)
        ]);
    }

    public function update(Request $request, $id)
    {
        $snapshot = CampaignSnapshot::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'notes' => 'nullable|string'
        ]);

        $snapshot->update($validated);

        return redirect()->back()->with('success', 'Snapshot updated successfully');
    }
}
