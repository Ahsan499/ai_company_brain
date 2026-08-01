<?php

namespace App\Services;

use App\Enums\TaskStatus;
use App\Models\Meeting;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\User;
use Carbon\Carbon;

class WeeklyDigestCompiler
{
    /**
     * @return array{tasks_completed:int,upcoming_meetings:int,hours_logged:float,week_start:string,week_end:string}
     */
    public function compile(User $user, ?Carbon $reference = null): array
    {
        $reference ??= now();
        $weekStart = $reference->copy()->startOfWeek();
        $weekEnd = $reference->copy()->endOfWeek();

        $tasksCompleted = Task::query()
            ->where('assignee_id', $user->id)
            ->where('status', TaskStatus::Done->value)
            ->whereBetween('updated_at', [$weekStart, $weekEnd])
            ->count();

        $upcomingMeetings = Meeting::query()
            ->where(function ($q) use ($user) {
                $q->where('organizer_id', $user->id)
                    ->orWhereHas('attendees', fn ($a) => $a->where('users.id', $user->id));
            })
            ->whereDate('date', '>=', $weekEnd->toDateString())
            ->whereDate('date', '<=', $weekEnd->copy()->addDays(7)->toDateString())
            ->count();

        $minutes = (int) TimeEntry::query()
            ->where('user_id', $user->id)
            ->whereBetween('date', [$weekStart->toDateString(), $weekEnd->toDateString()])
            ->sum('duration_minutes');

        return [
            'tasks_completed' => $tasksCompleted,
            'upcoming_meetings' => $upcomingMeetings,
            'hours_logged' => round($minutes / 60, 1),
            'week_start' => $weekStart->toDateString(),
            'week_end' => $weekEnd->toDateString(),
        ];
    }
}
