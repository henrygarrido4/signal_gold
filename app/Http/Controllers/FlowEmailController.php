<?php

namespace App\Http\Controllers;

use App\Models\Flow;
use App\Models\FlowEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class FlowEmailController extends Controller
{
    public function store(Request $request, Flow $flow)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'subject' => 'required|string|max:255',
                'delay' => 'required|string|max:255',
                'image' => 'nullable|image|max:2048',
                'workflow_url' => 'nullable|url|max:255',
                'email_link' => 'nullable|url|max:255',
                'workflow_name' => 'nullable|string|max:255',
                'campaign_id' => 'nullable|string|max:255',
                'send_list' => 'nullable|string|max:255',
                'suppression_lists' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            $data = array_map(function ($value) {
                return $value === '' || $value === 'null' ? null : $value;
            }, $request->only([
                'name',
                'subject',
                'delay',
                'workflow_name',
                'workflow_url',
                'campaign_id',
                'email_link',
                'send_list',
                'suppression_lists',
                'description'
            ]));

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('email-templates', 'public');
                $data['image_path'] = $path;
            }

            $email = $flow->emails()->create($data);
            return response()->json($email);
        } catch (\Exception $e) {
            Log::error('Email creation error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to create email',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, Flow $flow, FlowEmail $flowEmail)
    {
        try {
            // Log incoming request data
            Log::info('Email update request:', [
                'flow_id' => $flow->id,
                'email_id' => $flowEmail->id,
                'request_data' => $request->all()
            ]);

            if ($flowEmail->flow_id !== $flow->id) {
                return response()->json(['error' => 'Email does not belong to this flow'], 403);
            }

            // Validate request
            $request->validate([
                'name' => 'required|string|max:255',
                'subject' => 'required|string|max:255',
                'delay' => 'required|string|max:255',
                'image' => 'nullable|image|max:2048',
                'workflow_url' => 'nullable|url:http,https|max:255',
                'email_link' => 'nullable|url:http,https|max:255',
                'workflow_name' => 'nullable|string|max:255',
                'campaign_id' => 'nullable|string|max:255',
                'send_list' => 'nullable|string|max:255',
                'suppression_lists' => 'nullable|string',
                'description' => 'nullable|string',
            ]);

            // Log validated data
            Log::info('Validated data:', ['data' => $request->all()]);

            // Create update data array and handle empty values
            $updateData = array_map(function ($value) {
                return $value === '' || $value === 'null' ? null : $value;
            }, [
                'name' => $request->input('name'),
                'subject' => $request->input('subject'),
                'delay' => $request->input('delay'),
                'workflow_name' => $request->input('workflow_name'),
                'workflow_url' => $request->input('workflow_url'),
                'campaign_id' => $request->input('campaign_id'),
                'email_link' => $request->input('email_link'),
                'send_list' => $request->input('send_list'),
                'suppression_lists' => $request->input('suppression_lists'),
                'description' => $request->input('description')
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                try {
                    // Delete old image if exists
                    if ($flowEmail->image_path) {
                        Storage::disk('public')->delete($flowEmail->image_path);
                    }
                    $path = $request->file('image')->store('email-templates', 'public');
                    $updateData['image_path'] = $path;

                    Log::info('Image uploaded:', ['path' => $path]);
                } catch (\Exception $e) {
                    Log::error('Image upload error: ' . $e->getMessage(), [
                        'exception' => $e,
                        'flow_id' => $flow->id,
                        'email_id' => $flowEmail->id
                    ]);
                    throw $e;
                }
            }

            // Update the email
            try {
                Log::info('Attempting to update email with data:', ['data' => $updateData]);

                $flowEmail->update($updateData);
                $updated = $flowEmail->fresh();

                Log::info('Email updated successfully:', ['updated_data' => $updated->toArray()]);

                return response()->json($updated);
            } catch (\Exception $e) {
                Log::error('Email update error: ' . $e->getMessage(), [
                    'exception' => $e,
                    'flow_id' => $flow->id,
                    'email_id' => $flowEmail->id,
                    'update_data' => $updateData,
                    'sql' => $e->getTraceAsString()
                ]);
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Email update error: ' . $e->getMessage(), [
                'exception' => $e,
                'flow_id' => $flow->id,
                'email_id' => $flowEmail->id,
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to update email',
                'message' => $e->getMessage(),
                'debug' => config('app.debug') ? $e->getTraceAsString() : null
            ], 500);
        }
    }

    public function destroy(Flow $flow, FlowEmail $flowEmail)
    {
        try {
            // Verify the email belongs to the flow
            if ($flowEmail->flow_id !== $flow->id) {
                return response()->json(['error' => 'Email does not belong to this flow'], 403);
            }

            // Delete image if exists
            if ($flowEmail->image_path) {
                Storage::disk('public')->delete($flowEmail->image_path);
            }

            $flowEmail->delete();
            return response()->noContent();
        } catch (\Exception $e) {
            Log::error('Email deletion error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to delete email',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function removeImage(Flow $flow, FlowEmail $flowEmail)
    {
        try {
            if ($flowEmail->flow_id !== $flow->id) {
                return response()->json(['error' => 'Email does not belong to this flow'], 403);
            }

            if ($flowEmail->image_path) {
                Storage::disk('public')->delete($flowEmail->image_path);
                $flowEmail->update(['image_path' => null]);
            }

            return response()->json($flowEmail->fresh());
        } catch (\Exception $e) {
            Log::error('Image removal error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to remove image',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
