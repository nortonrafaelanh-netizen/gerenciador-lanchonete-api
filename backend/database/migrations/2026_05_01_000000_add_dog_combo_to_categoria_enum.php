<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Skip for MySQL/SQLite since they don't have enums
        // Just return and let seeders validate against acceptable values
    }

    public function down(): void
    {
    }
};
