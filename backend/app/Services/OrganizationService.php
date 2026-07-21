<?php

namespace App\Services;

use App\Http\Resources\Organization\OrganizationResource;
use App\Models\Organization;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrganizationService
{
    /**
     * Get all organizations.
     */
    public function index()
    {
        return OrganizationResource::collection(
            Organization::latest()->paginate(10)
        );
    }

    /**
     * Store organization.
     */
    public function store(array $data)
    {
        return DB::transaction(function () use ($data) {

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $organization = Organization::create($data);

            return new OrganizationResource($organization);
        });
    }

    /**
     * Get single organization.
     */
    public function show($id)
    {
        $organization = Organization::findOrFail($id);

        return new OrganizationResource($organization);
    }

    /**
     * Update organization.
     */
    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {

            $organization = Organization::findOrFail($id);

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $organization->update($data);

            return new OrganizationResource($organization);
        });
    }

    /**
     * Delete organization.
     */
    public function destroy($id)
    {
        $organization = Organization::findOrFail($id);

        $organization->delete();

        return true;
    }
}