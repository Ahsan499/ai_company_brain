<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Organization\StoreOrganizationRequest;
use App\Http\Requests\Organization\UpdateOrganizationRequest;
use App\Http\Resources\Organization\OrganizationResource;
use App\Models\Organization;
use App\Services\OrganizationService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    use ApiResponse;

    public function __construct(protected OrganizationService $organizationService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Organization::class);

        $organizations = $this->organizationService->index($request, $request->user());

        return OrganizationResource::collection($organizations)
            ->additional([
                'success' => true,
                'message' => 'Organizations retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreOrganizationRequest $request): JsonResponse
    {
        $organization = $this->organizationService->store($request->validated());

        return $this->successResponse(
            new OrganizationResource($organization),
            'Organization created successfully.',
            201
        );
    }

    public function show(Organization $organization): JsonResponse
    {
        $this->authorize('view', $organization);

        $organization = $this->organizationService->show($organization);

        return $this->successResponse(
            new OrganizationResource($organization),
            'Organization retrieved successfully.'
        );
    }

    public function update(UpdateOrganizationRequest $request, Organization $organization): JsonResponse
    {
        $organization = $this->organizationService->update($organization, $request->validated());

        return $this->successResponse(
            new OrganizationResource($organization),
            'Organization updated successfully.'
        );
    }

    public function destroy(Organization $organization): JsonResponse
    {
        $this->authorize('delete', $organization);

        $this->organizationService->destroy($organization);

        return $this->successResponse(null, 'Organization deleted successfully.');
    }
}
