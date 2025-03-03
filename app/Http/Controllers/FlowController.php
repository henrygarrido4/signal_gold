<?php

namespace App\Http\Controllers;

use App\Models\Flow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FlowController extends Controller
{
    public function index()
    {
        try {
            return Flow::with('emails')->get();
        } catch (\Exception $e) {
            Log::error('Flow index error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch flows'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:draft,active',
            ]);

            $flow = Flow::create($validated);
            return response()->json($flow->load('emails'));
        } catch (\Exception $e) {
            Log::error('Flow creation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create flow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Flow $flow)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|in:draft,active',
            ]);

            $flow->update($validated);
            return response()->json($flow->load('emails'));
        } catch (\Exception $e) {
            Log::error('Flow update error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to update flow',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Flow $flow)
    {
        try {
            $flow->delete();
            return response()->noContent();
        } catch (\Exception $e) {
            Log::error('Flow deletion error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to delete flow',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
