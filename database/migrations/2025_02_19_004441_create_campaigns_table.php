<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Add any additional fields that aren't in the original campaigns table
        Schema::table('campaigns', function (Blueprint $table) {
            // Add any new fields here if needed
        });
    }

    public function down()
    {
        Schema::table('campaigns', function (Blueprint $table) {
            // Drop any added columns
        });
    }
};
