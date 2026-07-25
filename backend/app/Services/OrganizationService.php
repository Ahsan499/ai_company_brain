<?php

namespace App\Services;

use App\Http\Resources\Organization\OrganizationResource;
use App\Models\Organization;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class OrganizationService
{
    protected SearchService $searchService;
    protected AuditLogService $auditLogService;

    public function __construct(
        SearchService $searchService,
        AuditLogService $auditLogService
    ) {
        $this->searchService = $searchService;
        $this->auditLogService = $auditLogService;
    }

    /**
     * Get all organizations.
     */
    public function index(Request $request)
    {
        $query = Organization::query();

        return OrganizationResource::collection(
            $this->searchService->apply($query, $request)
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

            // Audit Log
            $this->auditLogService->log(
                'created',
                $organization,
                null,
                $organization->toArray()
            );

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

            // Save old values
            $oldValues = $organization->toArray();

            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            $organization->update($data);

            // Audit Log
            $this->auditLogService->log(
                'updated',
                $organization,
                $oldValues,
                $organization->fresh()->toArray()
            );

            return new OrganizationResource($organization);
        });
    }

    /**
     * Delete organization.
     */
    public function destroy($id)
    {
        $organization = Organization::findOrFail($id);

        // Save old values
        $oldValues = $organization->toArray();

        // Audit Log
        $this->auditLogService->log(
            'deleted',
            $organization,
            $oldValues,
            null
        );

        $organization->delete();

        return true;
    }
}