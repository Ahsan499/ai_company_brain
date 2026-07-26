<?php

namespace App\Services;

use App\Enums\Priority;
use App\Enums\ProjectStatus;
use App\Enums\TaskStatus;
use App\Models\Project;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProjectService
{
    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $query = Project::query()
            ->with(['organization', 'department', 'members', 'milestones'])
            ->withCount($this->taskCountRelations())
            ->withCount('members')
            ->withSum('timeEntries', 'duration_minutes')
            ->search($request->string('search')->toString() ?: $request->string('query')->toString())
            ->organizationId($request->input('organization_id', $request->input('organizationId')))
            ->departmentId($request->input('department_id', $request->input('departmentId')))
            ->status($request->string('status')->toString())
            ->priority($request->string('priority')->toString())
            ->latest('id');

        if (! $actor->hasRole('Super Admin')) {
            $query->where('organization_id', $actor->organization_id);
        }

        return $query->paginate($perPage);
    }

    public function show(Project $project): Project
    {
        return $project->load(['organization', 'department', 'members', 'milestones', 'teams'])
            ->loadCount($this->taskCountRelations())
            ->loadCount('members')
            ->loadSum('timeEntries', 'duration_minutes');
    }

    public function store(array $data, User $actor): Project
    {
        return DB::transaction(function () use ($data, $actor) {
            $project = Project::query()->create([
                'organization_id' => $data['organization_id'],
                'department_id' => $data['department_id'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? ProjectStatus::Planning->value,
                'priority' => $data['priority'] ?? Priority::Medium->value,
                'progress' => $data['progress'] ?? 0,
                'due_date' => $data['due_date'] ?? null,
            ]);

            $memberSync = [];
            foreach ($data['member_ids'] ?? [] as $userId) {
                $memberSync[$userId] = ['role_in_project' => 'Contributor'];
            }
            if (! isset($memberSync[$actor->id])) {
                $memberSync[$actor->id] = ['role_in_project' => 'Project Lead'];
            }
            if ($memberSync) {
                $project->members()->sync($memberSync);
            }

            if (! empty($data['team_ids'])) {
                $project->teams()->sync($data['team_ids']);
            }

            return $this->show($project);
        });
    }

    public function update(Project $project, array $data): Project
    {
        return DB::transaction(function () use ($project, $data) {
            $project->fill([
                'organization_id' => $data['organization_id'] ?? $project->organization_id,
                'department_id' => $data['department_id'] ?? $project->department_id,
                'name' => $data['name'] ?? $project->name,
                'description' => array_key_exists('description', $data) ? $data['description'] : $project->description,
                'status' => $data['status'] ?? $project->status,
                'priority' => $data['priority'] ?? $project->priority,
                'progress' => array_key_exists('progress', $data) ? $data['progress'] : $project->progress,
                'due_date' => array_key_exists('due_date', $data) ? $data['due_date'] : $project->due_date,
            ])->save();

            if (array_key_exists('member_ids', $data)) {
                $sync = [];
                foreach ($data['member_ids'] ?? [] as $userId) {
                    $existing = $project->members()->where('users.id', $userId)->first();
                    $sync[$userId] = [
                        'role_in_project' => $existing?->pivot?->role_in_project ?? 'Contributor',
                    ];
                }
                $project->members()->sync($sync);
            }

            if (array_key_exists('team_ids', $data)) {
                $project->teams()->sync($data['team_ids'] ?? []);
            }

            $this->recalculateProgress($project);

            return $this->show($project->fresh());
        });
    }

    public function destroy(Project $project): void
    {
        $project->delete();
    }

    public function addMember(Project $project, int $userId, ?string $role): Project
    {
        $user = User::query()->findOrFail($userId);

        if ((int) $user->organization_id !== (int) $project->organization_id) {
            throw ValidationException::withMessages([
                'user_id' => ['User must belong to the same organization as the project.'],
            ]);
        }

        $project->members()->syncWithoutDetaching([
            $userId => ['role_in_project' => $role ?: 'Contributor'],
        ]);

        return $this->show($project);
    }

    public function removeMember(Project $project, int $userId): Project
    {
        $project->members()->detach($userId);

        return $this->show($project);
    }

    public function recalculateProgress(Project $project): void
    {
        $total = $project->tasks()->count();
        $done = $project->tasks()->where('status', TaskStatus::Done->value)->count();
        $progress = $total > 0 ? (int) round(($done / $total) * 100) : 0;
        $project->forceFill(['progress' => $progress])->save();
    }

    /** @return array<int|string, mixed> */
    public function taskCountRelations(): array
    {
        return [
            'tasks',
            'tasks as tasks_done_count' => fn ($q) => $q->where('status', TaskStatus::Done->value),
            'tasks as tasks_in_progress_count' => fn ($q) => $q->where('status', TaskStatus::InProgress->value),
            'tasks as tasks_overdue_count' => fn ($q) => $q
                ->whereNotNull('due_date')
                ->whereDate('due_date', '<', now()->toDateString())
                ->where('status', '!=', TaskStatus::Done->value),
        ];
    }
}
