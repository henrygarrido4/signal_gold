<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('campaign_snapshots', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('campaign_id');  // Changed to string to match the actual campaign IDs
            $table->string('period_type'); // daily, weekly, monthly, quarterly, yearly
            $table->jsonb('metrics_data'); // Store the daily metrics as JSON
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('campaign_snapshots');
    }
};
