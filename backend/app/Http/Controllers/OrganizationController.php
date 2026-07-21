<?php

namespace App\Http\Controllers;

use App\Http\Requests\Organization\StoreOrganizationRequest;
use App\Http\Requests\Organization\UpdateOrganizationRequest;
use App\Services\OrganizationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class OrganizationController extends Controller
{
    use ApiResponse;

    protected OrganizationService $organizationService;

    public function __construct(OrganizationService $organizationService)
    {
        $this->organizationService = $organizationService;
    }

    /**
     * Display all organizations.
     */
    public function index(): JsonResponse
    {
        $organizations = $this->organizationService->index();

        return $this->successResponse(
            $organizations,
            'Organizations retrieved successfully.'
        );
    }

    /**
     * Store a new organization.
     */
    public function store(StoreOrganizationRequest $request): JsonResponse
    {
        $organization = $this->organizationService->store(
            $request->validated()
        );

        return $this->successResponse(
            $organization,
            'Organization created successfully.',
            201
        );
    }

    /**
     * Display a single organization.
     */
    public function show(int $id): JsonResponse
    {
        $organization = $this->organizationService->show($id);

        return $this->successResponse(
            $organization,
            'Organization retrieved successfully.'
        );
    }

    /**
     * Update an organization.
     */
    public function update(UpdateOrganizationRequest $request, int $id): JsonResponse
    {
        $organization = $this->organizationService->update(
            $id,
            $request->validated()
        );

        return $this->successResponse(
            $organization,
            'Organization updated successfully.'
        );
    }

    /**
     * Delete an organization.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->organizationService->destroy($id);

        return $this->successResponse(
            [],
            'Organization deleted successfully.'
        );
    }
}