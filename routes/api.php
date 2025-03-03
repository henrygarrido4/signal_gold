<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CampaignLogController;
use App\Http\Controllers\CampaignSnapshotController;
use App\Http\Controllers\CKEditorController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth')->group(function () {
    Route::get('/analytics/campaign-data', [AnalyticsController::class, 'getCampaignData']);
    Route::get('/analytics/campaign-data/download', [AnalyticsController::class, 'downloadData']);
    Route::get('/campaign-logs', [CampaignLogController::class, 'index']);
    Route::post('/campaign-logs', [CampaignLogController::class, 'store']);
    Route::post('/campaign-snapshots', [CampaignSnapshotController::class, 'store']);
    Route::post('/campaign-snapshots/export', [CampaignSnapshotController::class, 'export'])
        ->name('campaign-snapshots.export');
    Route::put('/campaign-logs/{log}', [CampaignLogController::class, 'update']);
    Route::delete('/campaign-logs/{log}', [CampaignLogController::class, 'destroy']);
    Route::post('/ckeditor/upload', [CKEditorController::class, 'upload']);
});
