<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('project_bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Each user can bookmark a project only once
            $table->unique(['user_id', 'project_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('project_bookmarks');
    }
};
