<?php

namespace Database\Seeders;

use App\Enums\DepartmentStatus;
use App\Models\Department;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\Support\FrontendDump;
use Database\Seeders\Support\IdMap;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        foreach (FrontendDump::get('DEPARTMENTS') as $row) {
            $dept = Department::query()->create([
                'organization_id' => IdMap::orgId($row['organizationId']),
                'name' => $row['name'],
                'description' => $row['description'] ?? null,
                'status' => DepartmentStatus::from($row['status'] ?? 'active'),
                'manager_id' => IdMap::userId($row['managerId'] ?? null),
                'avg_tenure_months' => $row['avgTenureMonths'] ?? null,
                'created_at' => isset($row['createdAt']) ? Carbon::parse($row['createdAt'])->startOfDay() : now(),
                'updated_at' => now(),
            ]);

            IdMap::$departments[$row['id']] = $dept->id;

            $memberIds = collect($row['memberIds'] ?? [])
                ->map(fn ($id) => IdMap::userId($id))
                ->filter()
                ->values()
                ->all();

            if ($memberIds) {
                $dept->members()->sync($memberIds);
            }
        }

        // Attach users.department_id from frontend user records
        foreach (FrontendDump::get('USERS') as $row) {
            $userId = IdMap::userId($row['id'] ?? null);
            $deptId = IdMap::deptId($row['departmentId'] ?? null);
            if ($userId && $deptId) {
                User::query()->whereKey($userId)->update(['department_id' => $deptId]);
            }
        }
    }
}
