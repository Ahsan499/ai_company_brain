<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->unique()->after('email');
            $table->string('microsoft_id')->nullable()->unique()->after('google_id');
            $table->string('avatar_url')->nullable()->after('initials');
        });

        // OAuth-only users have no password.
        DB::statement('ALTER TABLE users MODIFY password VARCHAR(255) NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL');

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['google_id']);
            $table->dropUnique(['microsoft_id']);
            $table->dropColumn(['google_id', 'microsoft_id', 'avatar_url']);
        });
    }
};
