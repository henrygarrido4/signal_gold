<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    public function up()
    {
        // Drop any existing team member related tables
        Schema::dropIfExists('project_team_members');
        Schema::dropIfExists('project_members');
        Schema::dropIfExists('project_user');

        // Create the single, proper pivot table
        Schema::create('project_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['project_id', 'user_id']);
        });

        // Log the cleanup using PostgreSQL specific query
        $tables = DB::select("
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        ");

        Log::info('Project team members tables cleanup:', [
            'tables_after_cleanup' => collect($tables)->pluck('table_name'),
            'project_user_columns' => Schema::getColumnListing('project_user')
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('project_user');
    }
};
