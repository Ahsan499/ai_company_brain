<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage_users',
            'manage_organizations',
            'manage_departments',
            'manage_teams',
            'manage_projects',
            'delete_projects',
            'manage_tasks',
            'manage_meetings',
            'manage_files',
            'manage_time_tracking',
            'manage_settings',
            'manage_roles',
            'view_billing',
            'view_reports',
            'view_audit_logs',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $roles = [
            'Super Admin',
            'Organization Owner',
            'Organization Admin',
            'Department Manager',
            'Team Lead',
            'Employee',
            'HR',
            'Guest',
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ]);
        }

        Role::findByName('Super Admin')->syncPermissions(Permission::all());

        Role::findByName('Organization Owner')->syncPermissions([
            'manage_users',
            'manage_organizations',
            'manage_departments',
            'manage_teams',
            'manage_projects',
            'delete_projects',
            'manage_tasks',
            'manage_meetings',
            'manage_files',
            'manage_time_tracking',
            'manage_settings',
            'manage_roles',
            'view_billing',
            'view_reports',
            'view_audit_logs',
        ]);

        Role::findByName('Organization Admin')->syncPermissions([
            'manage_users',
            'manage_departments',
            'manage_teams',
            'manage_projects',
            'delete_projects',
            'manage_tasks',
            'manage_meetings',
            'manage_files',
            'manage_time_tracking',
            'manage_settings',
            'view_reports',
            'view_audit_logs',
        ]);

        Role::findByName('Department Manager')->syncPermissions([
            'manage_teams',
            'manage_projects',
            'delete_projects',
            'manage_tasks',
            'manage_meetings',
            'manage_files',
            'manage_time_tracking',
            'view_reports',
        ]);

        Role::findByName('Team Lead')->syncPermissions([
            'manage_tasks',
            'manage_meetings',
            'manage_files',
            'manage_time_tracking',
            'view_reports',
        ]);

        Role::findByName('Employee')->syncPermissions([
            'manage_tasks',
            'manage_files',
            'manage_time_tracking',
        ]);

        Role::findByName('HR')->syncPermissions([
            'manage_users',
            'manage_departments',
            'manage_meetings',
            'view_reports',
        ]);

        Role::findByName('Guest')->syncPermissions([]);
    }
}
