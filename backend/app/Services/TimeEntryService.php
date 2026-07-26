<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\User;
use App\Policies\TimeEntryPolicy;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TimeEntryService
{
    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);
        $policy = app(TimeEntryPolicy::class);

        $requestedUserId = $request->input('user_id', $request->input('userId'));

        // Default to authenticated user unless manager+ is scoping reports
        if ($requestedUserId === null || $requestedUserId === '') {
            $userId = $policy->canViewReports($actor) && $request->boolean('all_users')
                ? null
                : $actor->id;
        } else {
            $userId = $requestedUserId;
            if (! $policy->canViewReports($actor) && (int) $userId !== (int) $actor->id) {
                $userId = $actor->id;
            }
        }

        $query = TimeEntry::query()
            ->with(['user', 'task', 'project', 'team'])
            ->userId($userId)
            ->taskId($request->input('task_id', $request->input('taskId')))
            ->projectId($request->input('project_id', $request->input('projectId')))
            ->teamId($request->input('team_id', $request->input('teamId')))
            ->dateBetween(
                $request->input('date_from', $request->input('dateFrom')),
                $request->input('date_to', $request->input('dateTo'))
            )
            ->billable($request->input('billable'))
            ->latest('date')
            ->latest('id');

        if (! $actor->hasRole('Super Admin')) {
            $query->whereHas('user', fn ($q) => $q->where('organization_id', $actor->organization_id));
        }

        // Employees without report access stay on own entries
        if (! $policy->canViewReports($actor)) {
            $query->where('user_id', $actor->id);
        }

        return $query->paginate($perPage);
    }

    public function show(TimeEntry $entry): TimeEntry
    {
        return $entry->load(['user', 'task', 'project', 'team']);
    }

    public function store(array $data, User $actor): TimeEntry
    {
        $task = ! empty($data['task_id']) ? Task::query()->find($data['task_id']) : null;
        $projectId = $data['project_id'] ?? $task?->project_id;

        $entry = TimeEntry::query()->create([
            'user_id' => $data['user_id'] ?? $actor->id,
            'task_id' => $data['task_id'] ?? null,
            'project_id' => $projectId,
            'team_id' => $data['team_id'] ?? null,
            'date' => $data['date'],
            'duration_minutes' => $data['duration_minutes'],
            'note' => $data['note'] ?? null,
            'billable' => $data['billable'] ?? true,
        ]);

        return $this->show($entry);
    }

    public function update(TimeEntry $entry, array $data): TimeEntry
    {
        $entry->fill([
            'user_id' => $data['user_id'] ?? $entry->user_id,
            'task_id' => array_key_exists('task_id', $data) ? $data['task_id'] : $entry->task_id,
            'project_id' => array_key_exists('project_id', $data) ? $data['project_id'] : $entry->project_id,
            'team_id' => array_key_exists('team_id', $data) ? $data['team_id'] : $entry->team_id,
            'date' => $data['date'] ?? $entry->date,
            'duration_minutes' => $data['duration_minutes'] ?? $entry->duration_minutes,
            'note' => array_key_exists('note', $data) ? $data['note'] : $entry->note,
            'billable' => array_key_exists('billable', $data) ? $data['billable'] : $entry->billable,
        ])->save();

        return $this->show($entry->fresh());
    }

    public function destroy(TimeEntry $entry): void
    {
        $entry->delete();
    }

    public function baseScopedQuery(Request $request, User $actor)
    {
        $policy = app(TimeEntryPolicy::class);
        $query = TimeEntry::query()
            ->userId($request->input('user_id', $request->input('userId')))
            ->taskId($request->input('task_id', $request->input('taskId')))
            ->projectId($request->input('project_id', $request->input('projectId')))
            ->teamId($request->input('team_id', $request->input('teamId')))
            ->dateBetween(
                $request->input('date_from', $request->input('dateFrom')),
                $request->input('date_to', $request->input('dateTo'))
            );

        if (! $actor->hasRole('Super Admin')) {
            $query->whereHas('user', fn ($q) => $q->where('organization_id', $actor->organization_id));
        }

        if (! $policy->canViewReports($actor)) {
            $query->where('user_id', $actor->id);
        } elseif ($actor->hasRole('Team Lead') || $actor->hasRole('Department Manager') || $actor->hasRole('Employee')) {
            // Team lead / dept manager / employee with view_reports: own org, optionally own team
            if ($actor->hasRole('Team Lead') && ! $actor->hasAnyRole(['Organization Admin', 'Organization Owner', 'HR'])) {
                $teamIds = $actor->teams()->pluck('teams.id')->all();
                if ($teamIds) {
                    $query->where(function ($q) use ($actor, $teamIds) {
                        $q->whereIn('team_id', $teamIds)
                            ->orWhere('user_id', $actor->id);
                    });
                } else {
                    $query->where('user_id', $actor->id);
                }
            }
        }

        return $query;
    }

    public function summary(Request $request, User $actor): array
    {
        $query = $this->baseScopedQuery($request, $actor);
        $totalMinutes = (int) (clone $query)->sum('duration_minutes');
        $days = (int) (clone $query)->distinct('date')->count('date');
        $avg = $days > 0 ? round(($totalMinutes / 60) / $days, 2) : 0;

        $topProject = (clone $query)
            ->select('project_id', DB::raw('SUM(duration_minutes) as minutes'))
            ->whereNotNull('project_id')
            ->groupBy('project_id')
            ->orderByDesc('minutes')
            ->first();

        $topUser = (clone $query)
            ->select('user_id', DB::raw('SUM(duration_minutes) as minutes'))
            ->groupBy('user_id')
            ->orderByDesc('minutes')
            ->first();

        return [
            'totalMinutes' => $totalMinutes,
            'totalHours' => round($totalMinutes / 60, 2),
            'avgHoursPerDay' => $avg,
            'topProject' => $topProject ? [
                'id' => $topProject->project_id,
                'name' => Project::query()->find($topProject->project_id)?->name,
                'hours' => round(((int) $topProject->minutes) / 60, 2),
            ] : null,
            'topUser' => $topUser ? [
                'id' => $topUser->user_id,
                'name' => User::query()->find($topUser->user_id)?->name,
                'hours' => round(((int) $topUser->minutes) / 60, 2),
            ] : null,
        ];
    }

    public function byProject(Request $request, User $actor): array
    {
        $rows = $this->baseScopedQuery($request, $actor)
            ->select('project_id', DB::raw('SUM(duration_minutes) as minutes'))
            ->whereNotNull('project_id')
            ->groupBy('project_id')
            ->orderByDesc('minutes')
            ->get();

        $projects = Project::query()->whereIn('id', $rows->pluck('project_id'))->get()->keyBy('id');

        return $rows->map(fn ($row) => [
            'projectId' => $row->project_id,
            'projectName' => $projects[$row->project_id]->name ?? null,
            'durationMinutes' => (int) $row->minutes,
            'hours' => round(((int) $row->minutes) / 60, 2),
        ])->values()->all();
    }

    public function byUser(Request $request, User $actor): array
    {
        $rows = $this->baseScopedQuery($request, $actor)
            ->select('user_id', DB::raw('SUM(duration_minutes) as minutes'))
            ->groupBy('user_id')
            ->orderByDesc('minutes')
            ->get();

        $users = User::query()->whereIn('id', $rows->pluck('user_id'))->get()->keyBy('id');

        return $rows->map(fn ($row) => [
            'userId' => $row->user_id,
            'userName' => $users[$row->user_id]->name ?? null,
            'initials' => $users[$row->user_id]->initials ?? null,
            'durationMinutes' => (int) $row->minutes,
            'hours' => round(((int) $row->minutes) / 60, 2),
        ])->values()->all();
    }

    public function taskSummary(Task $task): array
    {
        $totalMinutes = (int) TimeEntry::query()->where('task_id', $task->id)->sum('duration_minutes');

        return [
            'taskId' => $task->id,
            'totalMinutes' => $totalMinutes,
            'totalHours' => round($totalMinutes / 60, 2),
            'entryCount' => TimeEntry::query()->where('task_id', $task->id)->count(),
        ];
    }

    public function hoursThisWeek(User $user): float
    {
        $start = Carbon::now()->startOfWeek();
        $end = Carbon::now()->endOfWeek();

        $minutes = (int) TimeEntry::query()
            ->where('user_id', $user->id)
            ->whereBetween('date', [$start->toDateString(), $end->toDateString()])
            ->sum('duration_minutes');

        return round($minutes / 60, 2);
    }
}
