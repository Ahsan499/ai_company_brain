<?php

namespace App\Services;

use App\Enums\DepartmentStatus;
use App\Models\Department;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DepartmentService
{
    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $query = Department::query()
            ->with(['organization', 'manager', 'members'])
            ->withCount([
                'members',
                'projects',
                'teams',
                'projects as active_projects_count' => fn ($q) => $q->where('status', 'active'),
            ])
            ->search($request->string('search')->toString() ?: $request->string('query')->toString())
            ->organizationId($request->input('organization_id', $request->input('organizationId')))
            ->managerId($request->input('manager_id', $request->input('managerId')))
            ->status($request->string('status')->toString())
            ->latest('id');

        if (! $actor->hasRole('Super Admin')) {
            $query->where('organization_id', $actor->organization_id);
        }

        return $query->paginate($perPage);
    }

    public function show(Department $department): Department
    {
        return $department->load(['organization', 'manager', 'members'])
            ->loadCount([
                'members',
                'projects',
                'teams',
                'projects as active_projects_count' => fn ($q) => $q->where('status', 'active'),
            ]);
    }

    public function store(array $data): Department
    {
        return DB::transaction(function () use ($data) {
            $department = Department::query()->create([
                'organization_id' => $data['organization_id'],
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? DepartmentStatus::Active->value,
                'manager_id' => $data['manager_id'] ?? null,
                'avg_tenure_months' => $data['avg_tenure_months'] ?? null,
            ]);

            $memberIds = collect($data['member_ids'] ?? [])->filter()->unique()->values()->all();
            if (! empty($data['manager_id']) && ! in_array($data['manager_id'], $memberIds, true)) {
                $memberIds[] = $data['manager_id'];
            }
            if ($memberIds) {
                $department->members()->sync($memberIds);
                User::query()
                    ->whereIn('id', $memberIds)
                    ->where(function ($q) use ($department) {
                        $q->whereNull('department_id')
                            ->orWhere('department_id', $department->id);
                    })
                    ->update(['department_id' => $department->id]);
            }

            return $this->show($department);
        });
    }

    public function update(Department $department, array $data): Department
    {
        return DB::transaction(function () use ($department, $data) {
            $department->fill([
                'organization_id' => $data['organization_id'] ?? $department->organization_id,
                'name' => $data['name'] ?? $department->name,
                'description' => array_key_exists('description', $data) ? $data['description'] : $department->description,
                'status' => $data['status'] ?? $department->status,
                'manager_id' => array_key_exists('manager_id', $data) ? $data['manager_id'] : $department->manager_id,
                'avg_tenure_months' => array_key_exists('avg_tenure_months', $data)
                    ? $data['avg_tenure_months']
                    : $department->avg_tenure_months,
            ])->save();

            if (array_key_exists('member_ids', $data)) {
                $memberIds = collect($data['member_ids'] ?? [])->filter()->unique()->values()->all();
                $department->members()->sync($memberIds);
                if ($memberIds) {
                    User::query()
                        ->whereIn('id', $memberIds)
                        ->where(function ($q) use ($department) {
                            $q->whereNull('department_id')
                                ->orWhere('department_id', $department->id);
                        })
                        ->update(['department_id' => $department->id]);
                }
            }

            return $this->show($department->fresh());
        });
    }

    public function destroy(Department $department): void
    {
        User::query()
            ->where('department_id', $department->id)
            ->update(['department_id' => null]);

        $department->delete();
    }
}
