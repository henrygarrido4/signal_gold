<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('comment_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_comment_id')->constrained()->onDelete('cascade');
            $table->string('name');      // Original filename
            $table->string('path');      // Storage path
            $table->string('type');      // MIME type
            $table->integer('size');     // File size in bytes
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('comment_attachments');
    }
};
