<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Meeting;
use App\Models\Organization;
use App\Models\Project;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\User;

class DashboardService
{
    /**
     * Get dashboard statistics.
     */
    public function statistics(): array
    {
        return [

            'organizations' => Organization::count(),

            'departments' => Department::count(),

            'users' => User::count(),

            'projects' => Project::count(),

            'tasks' => Task::count(),

            'pending_tasks' => Task::where('status', 'Pending')->count(),

            'in_progress_tasks' => Task::where('status', 'In Progress')->count(),

            'completed_tasks' => Task::where('status', 'Completed')->count(),

            'cancelled_tasks' => Task::where('status', 'Cancelled')->count(),

            'meetings' => Meeting::count(),

            'time_entries' => TimeEntry::count(),

            'total_minutes' => TimeEntry::sum('duration'),

            'total_hours' => round(TimeEntry::sum('duration') / 60, 2),

            'active_projects' => Project::where('is_active', true)->count(),

            'inactive_projects' => Project::where('is_active', false)->count(),

            'active_users' => User::count(), // Update later if you add user status

        ];
    }
}