<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('campaign_performances', function (Blueprint $table) {
            $table->id();
            $table->string('campaign_name');
            $table->date('date');
            $table->integer('emails_sent');
            $table->integer('emails_delivered');
            $table->integer('emails_opened');
            $table->integer('clicks');
            $table->integer('visitors');
            $table->integer('entries');
            $table->integer('leads');
            $table->integer('conversions');
            $table->decimal('delivery_rate', 5, 2)->default(0);
            $table->decimal('open_rate', 5, 2)->default(0);
            $table->decimal('click_through_rate', 5, 2)->default(0);
            $table->decimal('conversion_rate', 5, 2)->default(0);
            $table->decimal('lead_conversion_rate', 5, 2)->default(0);
            $table->string('source')->default('crm');
            $table->json('additional_metrics')->nullable();
            $table->timestamps();

            $table->index(['campaign_name', 'date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('campaign_performances');
    }
};
