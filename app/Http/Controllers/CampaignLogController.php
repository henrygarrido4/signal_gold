<?php

namespace App\Http\Controllers;

use App\Models\CampaignLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Inertia\Inertia;

class CampaignLogController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function store(Request $request)
    {
        try {
            Log::info('Received request data:', $request->all());

            $validated = $request->validate([
                'title' => 'required|string',
                'description' => 'nullable|string',
                'timestamp' => 'required|string',
                'campaign_id' => 'nullable|string',
                'event_type' => 'nullable|string',
                'status' => 'required|string|in:scheduled,running,completed,pending'
            ]);

            Log::info('Validated data:', $validated);
            Log::info('Received timestamp:', ['timestamp' => $validated['timestamp']]);

            try {
                $timestamp = Carbon::createFromFormat(
                    'Y-m-d h:i A',
                    $validated['timestamp'],
                    config('app.timezone')
                );

                Log::info('Parsed timestamp:', ['timestamp' => $timestamp->toDateTimeString()]);

                $validated['timestamp'] = $timestamp->format('Y-m-d H:i:s');
                Log::info('Final timestamp:', ['timestamp' => $validated['timestamp']]);

                $log = CampaignLog::create($validated);
                Log::info('Created log:', $log->toArray());

                return response()->json([
                    'message' => 'Event created successfully',
                    'data' => $log->getLogData()
                ], 201);
            } catch (\Exception $e) {
                Log::error('Timestamp parsing error:', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json([
                    'message' => 'Invalid date format',
                    'error' => $e->getMessage()
                ], 422);
            }
        } catch (\Exception $e) {
            Log::error('Event creation error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to create event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $query = CampaignLog::query()
                ->when($request->campaign_id, function ($q) use ($request) {
                    return $q->where('campaign_id', $request->campaign_id);
                })
                ->when($request->event_type, function ($q) use ($request) {
                    return $q->where('event_type', $request->event_type);
                });

            if ($request->recent) {
                // For schedule.vue - show upcoming events
                $events = $query->where('timestamp', '>=', now())
                    ->orderBy('timestamp', 'asc')
                    ->limit(4)
                    ->get()
                    ->map(fn($log) => $log->getScheduleData());

                return response()->json(['data' => $events]);
            }

            // For campaign-logs.vue - show all events
            $paginator = $query->latest('created_at')->paginate(15);
            $data = collect($paginator->items())->map(fn($log) => $log->getLogData());

            $paginatedData = [
                'data' => $data,
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage()
            ];

            if ($request->wantsJson()) {
                return response()->json($paginatedData);
            }

            return Inertia::render('dashboards/crm/campaign-logs', [
                'logs' => $paginatedData
            ]);

        } catch (\Exception $e) {
            Log::error('Event fetch failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, CampaignLog $log)
    {
        try {
            Log::info('Update request data:', $request->all());

            $validated = $request->validate([
                'title' => 'required|string',
                'description' => 'nullable|string',
                'timestamp' => 'required|string',
                'event_type' => 'nullable|string',
                'status' => 'required|string|in:scheduled,running,completed,pending'
            ]);

            Log::info('Update validated data:', $validated);
            Log::info('Update received timestamp:', ['timestamp' => $validated['timestamp']]);

            try {
                // Parse the timestamp in the same format as store method
                $timestamp = Carbon::createFromFormat(
                    'Y-m-d h:i A',
                    $validated['timestamp'],
                    config('app.timezone')
                );

                Log::info('Update parsed timestamp:', ['timestamp' => $timestamp->toDateTimeString()]);

                $validated['timestamp'] = $timestamp->format('Y-m-d H:i:s');
                Log::info('Update final timestamp:', ['timestamp' => $validated['timestamp']]);

                $log->update($validated);
                Log::info('Updated log:', $log->toArray());

                return response()->json([
                    'message' => 'Event updated successfully',
                    'data' => $log->getLogData()
                ]);
            } catch (\Exception $e) {
                Log::error('Update timestamp parsing error:', [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json([
                    'message' => 'Invalid date format',
                    'error' => $e->getMessage()
                ], 422);
            }
        } catch (\Exception $e) {
            Log::error('Event update error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to update event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(CampaignLog $log)
    {
        try {
            $log->delete();
            return response()->json([
                'message' => 'Event deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Event deletion failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete event',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
