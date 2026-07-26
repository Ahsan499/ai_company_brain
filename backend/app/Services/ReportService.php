<?php

namespace App\Services;

use App\Enums\ProjectStatus;
use App\Enums\Priority;
use App\Enums\TaskStatus;
use App\Enums\UserStatus;
use App\Models\Project;
use App\Models\Task;
use App\Models\Team;
use App\Models\TimeEntry;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ReportService
{
    private const REFERENCE_TODAY = '2026-07-26';

    /**
     * @return array{organization_id:?int,department_id:?int,date_from:?string,date_to:?string,team_id:?int}
     */
    public function resolveScope(Request $request, User $actor): array
    {
        $orgId = $request->input('organization_id', $request->input('organizationId'));
        $deptId = $request->input('department_id', $request->input('departmentId'));
        $from = $request->input('date_from', $request->input('dateFrom'));
        $to = $request->input('date_to', $request->input('dateTo'));

        if (! $actor->hasRole('Super Admin')) {
            $orgId = $actor->organization_id;
        }

        $teamId = null;
        if ($this->isEmployeeScoped($actor)) {
            $teamId = $actor->teams()->value('teams.id');
            if ($teamId) {
                $deptId = Team::query()->find($teamId)?->department_id ?? $deptId;
            }
        }

        return [
            'organization_id' => $orgId ? (int) $orgId : null,
            'department_id' => $deptId ? (int) $deptId : null,
            'date_from' => $from ?: null,
            'date_to' => $to ?: null,
            'team_id' => $teamId ? (int) $teamId : null,
        ];
    }

    public function isEmployeeScoped(User $actor): bool
    {
        if ($actor->hasRole('Super Admin')
            || $actor->can('view_reports')
            || $actor->hasAnyRole([
                'Organization Owner',
                'Organization Admin',
                'Department Manager',
                'Team Lead',
                'HR',
            ])) {
            return false;
        }

        return true;
    }

    public function overview(Request $request, User $actor): array
    {
        $scope = $this->resolveScope($request, $actor);
        $projects = $this->scopedProjects($scope)->get();
        $projectIds = $projects->pluck('id');
        $tasks = $this->scopedTasks($scope, $projectIds)->get();
        $entries = $this->scopedTimeEntries($scope, $projectIds);

        $activeProjects = $projects->where('status', ProjectStatus::Active)->count();
        $done = $tasks->where('status', TaskStatus::Done)->count();
        $inProgress = $tasks->where('status', TaskStatus::InProgress)->count();
        $today = Carbon::parse(self::REFERENCE_TODAY)->endOfDay();
        $overdue = $tasks->filter(function (Task $t) use ($today) {
            if ($t->status === TaskStatus::Done || ! $t->due_date) {
                return false;
            }

            return $t->due_date->copy()->endOfDay()->lt($today);
        })->count();

        $hoursMinutes = (int) $entries->sum('duration_minutes');

        $usersQuery = User::query()->where('status', UserStatus::Active);
        if ($scope['organization_id']) {
            $usersQuery->where('organization_id', $scope['organization_id']);
        }
        if ($scope['team_id']) {
            $usersQuery->whereHas('teams', fn ($q) => $q->where('teams.id', $scope['team_id']));
        }

        return [
            'activeProjects' => $activeProjects,
            'taskCounts' => [
                'total' => $tasks->count(),
                'done' => $done,
                'inProgress' => $inProgress,
                'overdue' => $overdue,
            ],
            'hoursLoggedThisPeriod' => round($hoursMinutes / 60, 1),
            'hoursLoggedThisPeriodMinutes' => $hoursMinutes,
            'activeUsers' => $usersQuery->count(),
        ];
    }

    public function taskCompletionTrend(Request $request, User $actor): array
    {
        $scope = $this->resolveScope($request, $actor);
        $projectIds = $this->scopedProjects($scope)->pluck('id');
        $tasks = $this->scopedTasks($scope, $projectIds)
            ->where('status', TaskStatus::Done->value)
            ->get(['id', 'due_date', 'status']);

        $end = Carbon::parse(self::REFERENCE_TODAY)->startOfDay();
        $weeks = [];

        for ($i = 7; $i >= 0; $i--) {
            $weekEnd = $end->copy()->subWeeks($i);
            $weekStart = $weekEnd->copy()->subDays(6);
            $after = $weekStart->toDateString();
            $before = $weekEnd->toDateString();
            $completed = $tasks->filter(function (Task $t) use ($after, $before) {
                if (! $t->due_date) {
                    return false;
                }
                $d = $t->due_date->toDateString();

                return $d >= $after && $d <= $before;
            })->count();

            $weeks[] = [
                'label' => $weekEnd->format('M j'),
                'date' => $before,
                'completed' => $completed,
                'after' => $after,
                'before' => $before,
            ];
        }

        return $weeks;
    }

    public function projectsByStatus(Request $request, User $actor): array
    {
        $scope = $this->resolveScope($request, $actor);
        $projects = $this->scopedProjects($scope)->get(['id', 'status']);

        $colors = [
            'active' => '#2563EB',
            'completed' => '#10B981',
            'on-hold' => '#F59E0B',
            'planning' => '#94A3B8',
        ];

        return collect(ProjectStatus::cases())
            ->map(fn (ProjectStatus $status) => [
                'key' => $status->value,
                'name' => str_replace('-', ' ', ucfirst($status->value)),
                'value' => $projects->where('status', $status)->count(),
                'color' => $colors[$status->value] ?? '#94A3B8',
            ])
            ->filter(fn ($row) => $row['value'] > 0)
            ->values()
            ->all();
    }

    public function projectsByDepartment(Request $request, User $actor): array
    {
        $scope = $this->resolveScope($request, $actor);
        $projects = $this->scopedProjects($scope)->with('department')->get();

        return $projects
            ->groupBy(fn (Project $p) => $p->department?->name ?: 'Unassigned')
            ->map(fn (Collection $group, string $name) => [
                'name' => $name,
                'count' => $group->count(),
            ])
            ->sortByDesc('count')
            ->values()
            ->all();
    }

    public function tasksByStatus(Request $request, User $actor): array
    {
        $scope = $this->resolveScope($request, $actor);
        $projectIds = $this->scopedProjects($scope)->pluck('id');
        $tasks = $this->scopedTasks($scope, $projectIds)->get(['id', 'status']);

        $colors = [
            'done' => '#10B981',
            'in-progress' => '#2563EB',
            'in-review' => '#8B5CF6',
            'todo' => '#94A3B8',
        ];

        return collect(TaskStatus::cases())
            ->map(fn (TaskStatus $status) => [
                'key' => $status->value,
                'name' => str_replace('-', ' ', ucfirst($status->value)),
                'value' => $tasks->where('status', $status)->count(),
                'color' => $colors[$status->value] ?? '#94A3B8',
            ])
            ->values()
            ->all();
    }

    public function tasksByPriority(Request $request, User $actor): array
    {
        $scope = $this->resolveScope($request, $actor);
        $projectIds = $this->scopedProjects($scope)->pluck('id');
        $tasks = $this->scopedTasks($scope, $projectIds)->get(['id', 'priority']);

        $colors = [
            'urgent' => '#EF4444',
            'high' => '#F59E0B',
            'medium' => '#2563EB',
            'low' => '#94A3B8',
        ];

        return collect(Priority::cases())
            ->map(fn (Priority $priority) => [
                'key' => $priority->value,
                'name' => ucfirst($priority->value),
                'value' => $tasks->where('priority', $priority)->count(),
                'color' => $colors[$priority->value] ?? '#94A3B8',
            ])
            ->values()
            ->all();
    }

    public function overdueTasks(Request $request, User $actor): LengthAwarePaginator
    {
        $scope = $this->resolveScope($request, $actor);
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);
        $projectIds = $this->scopedProjects($scope)->pluck('id');
        $today = self::REFERENCE_TODAY;

        return $this->scopedTasks($scope, $projectIds)
            ->with(['project', 'organization', 'department', 'assignee', 'creator'])
            ->withCount([
                'subtasks',
                'subtasks as subtasks_done_count' => fn ($q) => $q->where('done', true),
                'comments',
            ])
            ->where('status', '!=', TaskStatus::Done->value)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', $today)
            ->orderBy('due_date')
            ->paginate($perPage);
    }

    public function teamPerformance(Request $request, User $actor): array
    {
        $scope = $this->resolveScope($request, $actor);

        $teamsQuery = Team::query()
            ->with(['organization', 'department', 'members'])
            ->withCount('members');

        if ($scope['organization_id']) {
            $teamsQuery->where('organization_id', $scope['organization_id']);
        }
        if ($scope['department_id']) {
            $teamsQuery->where('department_id', $scope['department_id']);
        }
        if ($scope['team_id']) {
            $teamsQuery->where('id', $scope['team_id']);
        }

        $teams = $teamsQuery->get();
        $projectIds = $this->scopedProjects($scope)->pluck('id');
        $tasks = $this->scopedTasks($scope, $projectIds)->get();
        $entries = $this->scopedTimeEntries($scope, $projectIds);

        return $teams->map(function (Team $team) use ($tasks, $entries) {
            $memberIds = $team->members->pluck('id')->all();
            $teamTasks = $tasks->whereIn('assignee_id', $memberIds);
            $completed = $teamTasks->where('status', TaskStatus::Done);

            $cycleDays = $completed->map(function (Task $t) {
                $start = $t->created_at?->toDateString();
                $end = $t->due_date?->toDateString() ?? $start;
                if (! $start || ! $end) {
                    return 1;
                }

                return max(1, (int) Carbon::parse($start)->diffInDays(Carbon::parse($end)));
            });

            $avgCompletion = $cycleDays->isEmpty()
                ? null
                : (int) round($cycleDays->avg());

            $minutes = (int) $entries
                ->filter(fn (TimeEntry $e) => in_array($e->user_id, $memberIds, true)
                    || (int) $e->team_id === (int) $team->id)
                ->sum('duration_minutes');

            return [
                'id' => $team->id,
                'name' => $team->name,
                'organizationName' => $team->organization?->name,
                'departmentName' => $team->department?->name,
                'memberCount' => (int) ($team->members_count ?? count($memberIds)),
                'tasksCompleted' => $completed->count(),
                'tasksTotal' => $teamTasks->count(),
                'avgCompletionDays' => $avgCompletion,
                'hoursLogged' => round($minutes / 60, 1),
                'hoursMinutes' => $minutes,
                'color' => $team->color ?? '#2563EB',
            ];
        })
            ->sortByDesc('tasksCompleted')
            ->values()
            ->all();
    }

    protected function scopedProjects(array $scope): Builder
    {
        $query = Project::query();

        if ($scope['organization_id']) {
            $query->where('organization_id', $scope['organization_id']);
        }
        if ($scope['department_id']) {
            $query->where('department_id', $scope['department_id']);
        }
        if ($scope['team_id']) {
            $teamId = $scope['team_id'];
            $query->where(function ($q) use ($teamId) {
                $q->whereHas('teams', fn ($t) => $t->where('teams.id', $teamId))
                    ->orWhereHas('members.teams', fn ($t) => $t->where('teams.id', $teamId));
            });
        }

        return $query;
    }

    protected function scopedTasks(array $scope, Collection $projectIds): Builder
    {
        $query = Task::query();

        if ($projectIds->isNotEmpty()) {
            $query->whereIn('project_id', $projectIds);
        } else {
            $query->whereRaw('1 = 0');
        }

        if ($scope['organization_id']) {
            $query->where('organization_id', $scope['organization_id']);
        }
        if ($scope['department_id']) {
            $query->where('department_id', $scope['department_id']);
        }

        return $query;
    }

    protected function scopedTimeEntries(array $scope, Collection $projectIds): Collection
    {
        $query = TimeEntry::query();

        if ($projectIds->isNotEmpty()) {
            $query->whereIn('project_id', $projectIds);
        } else {
            return collect();
        }

        if ($scope['date_from']) {
            $query->whereDate('date', '>=', $scope['date_from']);
        }
        if ($scope['date_to']) {
            $query->whereDate('date', '<=', $scope['date_to']);
        }

        return $query->get();
    }
}
