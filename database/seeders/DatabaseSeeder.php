<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Disable foreign key constraints for PostgreSQL
        DB::statement('SET CONSTRAINTS ALL DEFERRED');

        // Truncate tables and reset sequences in PostgreSQL
        DB::statement('TRUNCATE TABLE project_user, projects, users, campaigns, campaign_snapshots, flows, flow_emails RESTART IDENTITY CASCADE');

        // Seed the tables
        $this->call([
            TestUserSeeder::class,
            ProjectSeeder::class,
            CampaignSeeder::class,
            CampaignPerformanceSeeder::class,
            FlowSeeder::class,
        ]);
    }
}
