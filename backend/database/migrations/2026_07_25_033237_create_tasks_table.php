<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {

            $table->id();

            // Relationships
            $table->foreignId('organization_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('department_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('project_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('assigned_to')
                ->constrained('users')
                ->cascadeOnDelete();

            // Task Details
            $table->string('title');

            $table->text('description')->nullable();

            // Status
            $table->enum('status', [
                'Pending',
                'In Progress',
                'Completed',
                'Cancelled',
            ])->default('Pending');

            // Priority
            $table->enum('priority', [
                'Low',
                'Medium',
                'High',
            ])->default('Medium');

            // Dates
            $table->date('due_date')->nullable();

            // Active Flag
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Optional Indexes (recommended)
            $table->index('organization_id');
            $table->index('department_id');
            $table->index('project_id');
            $table->index('assigned_to');
            $table->index('status');
            $table->index('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};