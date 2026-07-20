<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        /*
        |--------------------------------------------------------------------------
        | Permissions
        |--------------------------------------------------------------------------
        */

        $permissions = [

            // Users
            'user.view',
            'user.create',
            'user.update',
            'user.delete',

            // Roles
            'role.view',
            'role.create',
            'role.update',
            'role.delete',

            // Permissions
            'permission.view',
            'permission.create',
            'permission.update',
            'permission.delete',

        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Roles
        |--------------------------------------------------------------------------
        */

        $superAdmin = Role::firstOrCreate([
            'name' => 'Super Admin',
            'guard_name' => 'web',
        ]);

        $organizationAdmin = Role::firstOrCreate([
            'name' => 'Organization Admin',
            'guard_name' => 'web',
        ]);

        $manager = Role::firstOrCreate([
            'name' => 'Manager',
            'guard_name' => 'web',
        ]);

        $employee = Role::firstOrCreate([
            'name' => 'Employee',
            'guard_name' => 'web',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Assign Permissions
        |--------------------------------------------------------------------------
        */

        $superAdmin->givePermissionTo(Permission::all());

        $organizationAdmin->givePermissionTo([
            'user.view',
            'user.create',
            'user.update',
            'role.view',
        ]);

        $manager->givePermissionTo([
            'user.view',
        ]);

        // Employee gets no permissions by default
    }
}