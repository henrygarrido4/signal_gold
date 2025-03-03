<?php

namespace App\Http\Controllers;

use App\Models\CampaignSnapshot;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function crm()
    {
        return Inertia::render('dashboards/crm/index', [
            'snapshots' => CampaignSnapshot::with('campaign')
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }
} 