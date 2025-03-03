<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Project;

return new class extends Migration
{
    public function up()
    {
        // First add the column as nullable
        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->after('id')
                ->constrained()
                ->onDelete('cascade');
        });

        // Then update existing records with a default user
        $defaultUser = \App\Models\User::first();
        if ($defaultUser) {
            Project::whereNull('user_id')->update(['user_id' => $defaultUser->id]);
        }

        // Finally make the column non-nullable
        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }

    public function down()
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
