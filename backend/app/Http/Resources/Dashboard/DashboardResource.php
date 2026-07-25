<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'organizations' => $this['organizations'],

            'departments' => $this['departments'],

            'users' => $this['users'],

            'projects' => [
                'total' => $this['projects'],
                'active' => $this['active_projects'],
                'inactive' => $this['inactive_projects'],
            ],

            'tasks' => [
                'total' => $this['tasks'],
                'pending' => $this['pending_tasks'],
                'in_progress' => $this['in_progress_tasks'],
                'completed' => $this['completed_tasks'],
                'cancelled' => $this['cancelled_tasks'],
            ],

            'meetings' => $this['meetings'],

            'time_tracking' => [
                'entries' => $this['time_entries'],
                'minutes' => $this['total_minutes'],
                'hours' => $this['total_hours'],
            ],

            'active_users' => $this['active_users'],

        ];
    }
}