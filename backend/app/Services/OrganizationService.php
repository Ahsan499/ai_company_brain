<?php

namespace App\Services;

use App\Enums\OrganizationPlan;
use App\Enums\OrganizationStatus;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrganizationService
{
    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $query = Organization::query()
            ->with('owner')
            ->withCount([
                'users',
                'departments',
                'projects',
                'projects as active_projects_count' => fn ($q) => $q->where('status', 'active'),
            ])
            ->search($request->string('search')->toString() ?: $request->string('query')->toString())
            ->status($request->string('status')->toString())
            ->plan($request->string('plan')->toString())
            ->latest('id');

        if (! $actor->hasRole('Super Admin')) {
            $query->whereKey($actor->organization_id);
        }

        return $query->paginate($perPage);
    }

    public function show(Organization $organization): Organization
    {
        return $organization->load(['owner', 'users.department', 'users.roles'])
            ->loadCount([
                'users',
                'departments',
                'projects',
                'projects as active_projects_count' => fn ($q) => $q->where('status', 'active'),
            ]);
    }

    public function store(array $data): Organization
    {
        $ownerId = $data['owner_id'] ?? null;
        if (! $ownerId && ! empty($data['owner_email'])) {
            $ownerId = User::query()->where('email', $data['owner_email'])->value('id');
        }

        $name = $data['name'];
        $slug = $data['slug'] ?? Str::slug($name);
        $slug = $this->uniqueSlug($slug);

        $organization = Organization::query()->create([
            'name' => $name,
            'slug' => $slug,
            'industry' => $data['industry'] ?? null,
            'size' => $data['size'] ?? '11–50',
            'plan' => $data['plan'] ?? OrganizationPlan::Growth->value,
            'status' => $data['status'] ?? OrganizationStatus::Active->value,
            'website' => $data['website'] ?? null,
            'location' => $data['location'] ?? null,
            'description' => $data['description'] ?? null,
            'initials' => $data['initials'] ?? $this->initialsFromName($name),
            'owner_id' => $ownerId,
        ]);

        return $this->show($organization);
    }

    public function update(Organization $organization, array $data): Organization
    {
        $ownerId = $data['owner_id'] ?? $organization->owner_id;
        if (array_key_exists('owner_email', $data) && $data['owner_email']) {
            $ownerId = User::query()->where('email', $data['owner_email'])->value('id') ?? $ownerId;
        }

        if (isset($data['slug'])) {
            $data['slug'] = $this->uniqueSlug($data['slug'], $organization->id);
        }

        $organization->fill([
            'name' => $data['name'] ?? $organization->name,
            'slug' => $data['slug'] ?? $organization->slug,
            'industry' => array_key_exists('industry', $data) ? $data['industry'] : $organization->industry,
            'size' => array_key_exists('size', $data) ? $data['size'] : $organization->size,
            'plan' => $data['plan'] ?? $organization->plan,
            'status' => $data['status'] ?? $organization->status,
            'website' => array_key_exists('website', $data) ? $data['website'] : $organization->website,
            'location' => array_key_exists('location', $data) ? $data['location'] : $organization->location,
            'description' => array_key_exists('description', $data) ? $data['description'] : $organization->description,
            'initials' => $data['initials'] ?? $organization->initials,
            'owner_id' => $ownerId,
        ])->save();

        return $this->show($organization->fresh());
    }

    public function destroy(Organization $organization): void
    {
        $organization->delete();
    }

    private function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = Str::slug($slug) ?: 'org';
        $candidate = $base;
        $i = 1;

        while (
            Organization::withTrashed()
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = $base.'-'.$i;
            $i++;
        }

        return $candidate;
    }

    private function initialsFromName(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];
        $initials = collect($parts)
            ->filter()
            ->take(2)
            ->map(fn ($p) => Str::upper(Str::substr($p, 0, 1)))
            ->implode('');

        return $initials !== '' ? $initials : 'OR';
    }
}
