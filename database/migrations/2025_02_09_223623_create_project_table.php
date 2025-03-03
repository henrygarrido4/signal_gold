<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('priority');  // Will store full string: 'High', 'Medium', 'Low'
            $table->string('status');    // Will store full string: 'In Progress', 'Completed'
            $table->date('deadline')->nullable();
            $table->string('privacy');
            $table->string('category');  // Changed from tags to category
            $table->json('skills')->nullable();
            $table->string('team_lead')->nullable();  // Will store full name
            $table->string('thumbnail')->nullable();
            $table->json('team_members')->nullable();
            $table->json('attached_files')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('projects');
    }
};
