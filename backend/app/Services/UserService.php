<?php

namespace App\Services;

use App\Enums\UserStatus;
use App\Models\Department;
use App\Models\User;
use App\Support\RoleLabel;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserService
{
    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $query = User::query()
            ->with(['organization', 'department', 'manager', 'teams', 'roles'])
            ->withCount(['assignedTasks', 'projects'])
            ->search($request->string('search')->toString() ?: $request->string('query')->toString())
            ->status($request->string('status')->toString())
            ->filterRole($request->string('role')->toString())
            ->departmentId($request->input('department_id', $request->input('departmentId')))
            ->organizationId($request->input('organization_id', $request->input('organizationId')))
            ->latest('id');

        // Department name filter (frontend uses department labels)
        $departmentName = $request->string('department')->toString();
        if ($departmentName && $departmentName !== 'all') {
            $query->whereHas('department', fn ($q) => $q->where('name', $departmentName));
        }

        if (! $actor->hasRole('Super Admin')) {
            $query->where('organization_id', $actor->organization_id);
        }

        return $query->paginate($perPage);
    }

    public function show(User $user, ?Request $request = null): User
    {
        $user = $user->load(['organization', 'department', 'manager', 'teams', 'roles'])
            ->loadCount(['assignedTasks', 'projects']);

        $include = request()->string('include')->toString();
        if (str_contains($include, 'timeStats')) {
            $user->setAttribute('hours_this_week', app(TimeEntryService::class)->hoursThisWeek($user));
        }

        return $user;
    }

    public function store(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $departmentId = $data['department_id'] ?? null;
            if (! $departmentId && ! empty($data['department_name']) && ! empty($data['organization_id'])) {
                $departmentId = Department::query()
                    ->where('organization_id', $data['organization_id'])
                    ->where('name', $data['department_name'])
                    ->value('id');
            }

            $password = $data['password'] ?? Str::password(12);
            $status = $data['status'] ?? (isset($data['password']) ? UserStatus::Active->value : UserStatus::Invited->value);

            $user = User::query()->create([
                'organization_id' => $data['organization_id'],
                'department_id' => $departmentId,
                'manager_id' => $data['manager_id'] ?? null,
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $password,
                'initials' => $data['initials'] ?? $this->initialsFromName($data['name']),
                'phone' => $data['phone'] ?? null,
                'location' => $data['location'] ?? null,
                'status' => $status,
                'email_verified_at' => now(),
            ]);

            $user->assignRole(RoleLabel::toSpatie($data['role']));

            return $this->show($user);
        });
    }

    public function update(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $departmentId = $data['department_id'] ?? $user->department_id;
            if (array_key_exists('department_name', $data) && $data['department_name']) {
                $orgId = $data['organization_id'] ?? $user->organization_id;
                $departmentId = Department::query()
                    ->where('organization_id', $orgId)
                    ->where('name', $data['department_name'])
                    ->value('id') ?? $departmentId;
            }

            $payload = [
                'organization_id' => $data['organization_id'] ?? $user->organization_id,
                'department_id' => $departmentId,
                'manager_id' => array_key_exists('manager_id', $data) ? $data['manager_id'] : $user->manager_id,
                'name' => $data['name'] ?? $user->name,
                'email' => $data['email'] ?? $user->email,
                'initials' => $data['initials'] ?? $user->initials,
                'phone' => array_key_exists('phone', $data) ? $data['phone'] : $user->phone,
                'location' => array_key_exists('location', $data) ? $data['location'] : $user->location,
                'status' => $data['status'] ?? $user->status,
            ];

            if (! empty($data['password'])) {
                $payload['password'] = $data['password'];
            }

            $user->fill($payload)->save();

            if (! empty($data['role'])) {
                $user->syncRoles([RoleLabel::toSpatie($data['role'])]);
            }

            return $this->show($user->fresh());
        });
    }

    public function destroy(User $user): void
    {
        $user->delete();
    }

    private function initialsFromName(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];
        $initials = collect($parts)
            ->filter()
            ->take(2)
            ->map(fn ($p) => Str::upper(Str::substr($p, 0, 1)))
            ->implode('');

        return $initials !== '' ? $initials : 'U';
    }
}
