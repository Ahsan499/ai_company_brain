<?php

namespace Database\Seeders;

use App\Enums\UserStatus;
use App\Models\Organization;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\Support\FrontendDump;
use Database\Seeders\Support\IdMap;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    private const ROLE_MAP = [
        'Super Admin' => 'Super Admin',
        'Org Owner' => 'Organization Owner',
        'Org Admin' => 'Organization Admin',
        'Dept Manager' => 'Department Manager',
        'Team Lead' => 'Team Lead',
        'Employee' => 'Employee',
        'HR' => 'HR',
        'Guest' => 'Guest',
    ];

    public function run(): void
    {
        $password = Hash::make('password');

        // Ensure Ahsan is first
        $users = FrontendDump::get('USERS');
        usort($users, function (array $a, array $b) {
            if (($a['id'] ?? '') === 'usr-ahsan') {
                return -1;
            }
            if (($b['id'] ?? '') === 'usr-ahsan') {
                return 1;
            }

            return 0;
        });

        foreach ($users as $row) {
            $email = $row['email'];
            if (($row['id'] ?? null) === 'usr-ahsan') {
                $email = 'ahsan@example.com';
            }

            $user = User::query()->create([
                'organization_id' => IdMap::orgId($row['organizationId'] ?? null),
                'department_id' => null, // set after departments exist
                'manager_id' => null,
                'name' => $row['name'],
                'email' => $email,
                'initials' => $row['initials'] ?? null,
                'phone' => $row['phone'] !== '' ? ($row['phone'] ?? null) : null,
                'location' => $row['location'] ?? null,
                'status' => UserStatus::from($row['status'] ?? 'active'),
                'password' => $password,
                'email_verified_at' => now(),
                'last_login_at' => now()->subMinutes(2),
                'created_at' => isset($row['joinedAt']) ? Carbon::parse($row['joinedAt'])->startOfDay() : now(),
                'updated_at' => now(),
            ]);

            IdMap::$users[$row['id']] = $user->id;

            $spatieRole = self::ROLE_MAP[$row['role'] ?? ''] ?? 'Employee';
            if (Role::where('name', $spatieRole)->exists()) {
                $user->assignRole($spatieRole);
            }
        }

        // Wire organization owners
        foreach (FrontendDump::get('ORGANIZATIONS') as $row) {
            $orgId = IdMap::orgId($row['id'] ?? null);
            if (! $orgId) {
                continue;
            }

            $ownerId = IdMap::findUserIdByEmail($row['ownerEmail'] ?? null)
                ?? IdMap::findUserIdByName($row['owner'] ?? null);

            if ($ownerId) {
                Organization::query()->whereKey($orgId)->update(['owner_id' => $ownerId]);
            }
        }

        // Wire managers by display name (after all users exist)
        foreach ($users as $row) {
            $managerName = $row['manager'] ?? null;
            if (! $managerName) {
                continue;
            }
            $managerId = IdMap::findUserIdByName($managerName);
            if ($managerId) {
                User::query()->whereKey(IdMap::userId($row['id']))->update([
                    'manager_id' => $managerId,
                ]);
            }
        }
    }
}
