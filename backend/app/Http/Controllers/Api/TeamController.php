<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Team\StoreTeamRequest;
use App\Http\Requests\Team\UpdateTeamRequest;
use App\Services\TeamService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    use ApiResponse;

    protected TeamService $teamService;

    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    public function index(): JsonResponse
    {
        return $this->successResponse(
            $this->teamService->index(),
            'Teams retrieved successfully.'
        );
    }

    public function store(StoreTeamRequest $request): JsonResponse
    {
        return $this->successResponse(
            $this->teamService->store($request->validated()),
            'Team created successfully.',
            201
        );
    }

    public function show(int $id): JsonResponse
    {
        return $this->successResponse(
            $this->teamService->show($id),
            'Team retrieved successfully.'
        );
    }

    public function update(UpdateTeamRequest $request, int $id): JsonResponse
    {
        return $this->successResponse(
            $this->teamService->update($id, $request->validated()),
            'Team updated successfully.'
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->teamService->destroy($id);

        return $this->successResponse(
            [],
            'Team deleted successfully.'
        );
    }
}