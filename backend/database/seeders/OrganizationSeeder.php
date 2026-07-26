<?php

namespace Database\Seeders;

use App\Enums\OrganizationPlan;
use App\Enums\OrganizationStatus;
use App\Models\Organization;
use Carbon\Carbon;
use Database\Seeders\Support\FrontendDump;
use Database\Seeders\Support\IdMap;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        foreach (FrontendDump::get('ORGANIZATIONS') as $row) {
            $org = Organization::query()->create([
                'name' => $row['name'],
                'slug' => $row['slug'],
                'industry' => $row['industry'] ?? null,
                'size' => $row['size'] ?? null,
                'plan' => OrganizationPlan::from($row['plan']),
                'status' => OrganizationStatus::from($row['status'] ?? 'active'),
                'website' => $row['website'] ?? null,
                'location' => $row['location'] ?? null,
                'description' => $row['description'] ?? null,
                'initials' => $row['initials'] ?? null,
                'owner_id' => null,
                'created_at' => isset($row['createdAt']) ? Carbon::parse($row['createdAt'])->startOfDay() : now(),
                'updated_at' => now(),
            ]);

            IdMap::$organizations[$row['id']] = $org->id;
        }
    }
}
