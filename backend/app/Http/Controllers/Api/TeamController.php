<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Team\StoreTeamMemberRequest;
use App\Http\Requests\Team\StoreTeamRequest;
use App\Http\Requests\Team\UpdateTeamRequest;
use App\Http\Resources\Project\ProjectResource;
use App\Http\Resources\Team\TeamResource;
use App\Http\Resources\User\UserResource;
use App\Models\Team;
use App\Models\User;
use App\Services\TeamService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    use ApiResponse;

    public function __construct(protected TeamService $teamService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Team::class);

        $teams = $this->teamService->index($request, $request->user());

        return TeamResource::collection($teams)
            ->additional([
                'success' => true,
                'message' => 'Teams retrieved successfully.',
            ])
            ->response();
    }

    public function store(StoreTeamRequest $request): JsonResponse
    {
        $team = $this->teamService->store($request->validated());

        return $this->successResponse(
            new TeamResource($team),
            'Team created successfully.',
            201
        );
    }

    public function show(Team $team): JsonResponse
    {
        $this->authorize('view', $team);

        $team = $this->teamService->show($team);

        return $this->successResponse(
            new TeamResource($team),
            'Team retrieved successfully.'
        );
    }

    public function update(UpdateTeamRequest $request, Team $team): JsonResponse
    {
        $team = $this->teamService->update($team, $request->validated());

        return $this->successResponse(
            new TeamResource($team),
            'Team updated successfully.'
        );
    }

    public function destroy(Team $team): JsonResponse
    {
        $this->authorize('delete', $team);

        $this->teamService->destroy($team);

        return $this->successResponse(null, 'Team deleted successfully.');
    }

    public function members(Request $request, Team $team): JsonResponse
    {
        $this->authorize('viewMembers', $team);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $request->attributes->set('team_lead_id', $team->team_lead_id);

        $members = $team->members()
            ->with(['organization', 'department', 'manager', 'teams', 'roles'])
            ->withCount(['assignedTasks', 'projects'])
            ->latest('users.id')
            ->paginate($perPage);

        return UserResource::collection($members)
            ->additional([
                'success' => true,
                'message' => 'Team members retrieved successfully.',
                'teamLeadId' => $team->team_lead_id,
            ])
            ->response();
    }

    public function addMember(StoreTeamMemberRequest $request, Team $team): JsonResponse
    {
        $team = $this->teamService->addMember($team, (int) $request->validated('user_id'));

        return $this->successResponse(
            new TeamResource($team),
            'Team member added successfully.',
            201
        );
    }

    public function removeMember(Team $team, User $user): JsonResponse
    {
        $this->authorize('manageMembers', $team);

        $team = $this->teamService->removeMember($team, $user->id);

        return $this->successResponse(
            new TeamResource($team),
            'Team member removed successfully.'
        );
    }

    public function projects(Request $request, Team $team): JsonResponse
    {
        $this->authorize('viewProjects', $team);

        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $projects = $team->projects()
            ->with(['organization', 'department', 'members', 'milestones', 'tasks'])
            ->withCount('tasks')
            ->latest('projects.id')
            ->paginate($perPage);

        return ProjectResource::collection($projects)
            ->additional([
                'success' => true,
                'message' => 'Team projects retrieved successfully.',
            ])
            ->response();
    }
}
