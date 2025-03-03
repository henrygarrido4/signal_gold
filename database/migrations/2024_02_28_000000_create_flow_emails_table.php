<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('flow_emails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flow_id')->constrained()->cascadeOnDelete();
            $table->string('campaign_id')->nullable();
            $table->string('name');
            $table->string('subject');
            $table->string('delay');
            $table->string('image_path')->nullable();
            $table->text('body')->nullable();
            $table->string('workflow_name')->nullable();
            $table->string('workflow_url')->nullable();
            $table->string('email_link')->nullable();
            $table->text('send_list')->nullable();
            $table->text('suppression_lists')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('flow_emails');
    }
};
