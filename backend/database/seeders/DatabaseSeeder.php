<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            OrganizationSeeder::class,
            UserSeeder::class,
            DepartmentSeeder::class,
            TeamSeeder::class,
            ProjectSeeder::class,
            TaskSeeder::class,
            MeetingSeeder::class,
            TimeEntrySeeder::class,
            FolderAndFileSeeder::class,
            AuditLogSeeder::class,
        ]);
    }
}
