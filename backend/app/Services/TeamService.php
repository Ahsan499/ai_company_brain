<?php

namespace App\Services;

use App\Enums\TeamStatus;
use App\Models\Team;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TeamService
{
    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $query = Team::query()
            ->with(['organization', 'department', 'lead', 'members', 'projects'])
            ->withCount(['members', 'projects'])
            ->search($request->string('search')->toString() ?: $request->string('query')->toString())
            ->organizationId($request->input('organization_id', $request->input('organizationId')))
            ->departmentId($request->input('department_id', $request->input('departmentId')))
            ->status($request->string('status')->toString())
            ->latest('id');

        if (! $actor->hasRole('Super Admin')) {
            $query->where('organization_id', $actor->organization_id);
        }

        return $query->paginate($perPage);
    }

    public function show(Team $team): Team
    {
        return $team->load(['organization', 'department', 'lead', 'members', 'projects'])
            ->loadCount(['members', 'projects']);
    }

    public function store(array $data): Team
    {
        return DB::transaction(function () use ($data) {
            $team = Team::query()->create([
                'organization_id' => $data['organization_id'],
                'department_id' => $data['department_id'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? TeamStatus::Active->value,
                'color' => $data['color'] ?? null,
                'team_lead_id' => $data['team_lead_id'] ?? null,
            ]);

            $memberIds = collect($data['member_ids'] ?? [])->filter()->unique()->values()->all();
            if (! empty($data['team_lead_id']) && ! in_array($data['team_lead_id'], $memberIds, true)) {
                $memberIds[] = $data['team_lead_id'];
            }
            if ($memberIds) {
                $team->members()->sync($memberIds);
            }

            if (! empty($data['project_ids'])) {
                $team->projects()->sync($data['project_ids']);
            }

            return $this->show($team);
        });
    }

    public function update(Team $team, array $data): Team
    {
        return DB::transaction(function () use ($team, $data) {
            $team->fill([
                'organization_id' => $data['organization_id'] ?? $team->organization_id,
                'department_id' => $data['department_id'] ?? $team->department_id,
                'name' => $data['name'] ?? $team->name,
                'description' => array_key_exists('description', $data) ? $data['description'] : $team->description,
                'status' => $data['status'] ?? $team->status,
                'color' => array_key_exists('color', $data) ? $data['color'] : $team->color,
                'team_lead_id' => array_key_exists('team_lead_id', $data) ? $data['team_lead_id'] : $team->team_lead_id,
            ])->save();

            if (array_key_exists('member_ids', $data)) {
                $memberIds = collect($data['member_ids'] ?? [])->filter()->unique()->values()->all();
                $team->members()->sync($memberIds);
            }

            if (array_key_exists('project_ids', $data)) {
                $team->projects()->sync($data['project_ids'] ?? []);
            }

            return $this->show($team->fresh());
        });
    }

    public function destroy(Team $team): void
    {
        $team->delete();
    }

    public function addMember(Team $team, int $userId): Team
    {
        $user = User::query()->findOrFail($userId);

        if ((int) $user->organization_id !== (int) $team->organization_id) {
            throw ValidationException::withMessages([
                'user_id' => ['User must belong to the same organization as the team.'],
            ]);
        }

        $team->members()->syncWithoutDetaching([$userId]);

        return $this->show($team);
    }

    public function removeMember(Team $team, int $userId): Team
    {
        if ((int) $team->team_lead_id === $userId) {
            throw ValidationException::withMessages([
                'user_id' => ['Cannot remove the team lead. Reassign the lead first.'],
            ]);
        }

        $team->members()->detach($userId);

        return $this->show($team);
    }
}
