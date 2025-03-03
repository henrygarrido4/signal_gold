<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('github_username')->nullable();
            $table->string('dribbble_username')->nullable();
            $table->string('pinterest_username')->nullable();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'github_username',
                'dribbble_username',
                'pinterest_username'
            ]);
        });
    }
};
