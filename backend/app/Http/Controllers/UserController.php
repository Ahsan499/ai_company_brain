<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    use ApiResponse;

    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display all users.
     */
    public function index(): JsonResponse
    {
        $users = $this->userService->index();

        return $this->successResponse(
            $users,
            'Users retrieved successfully.'
        );
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->store(
            $request->validated()
        );

        return $this->successResponse(
            $user,
            'User created successfully.',
            201
        );
    }

    /**
     * Display the specified user.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->show($id);

        return $this->successResponse(
            $user,
            'User retrieved successfully.'
        );
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->update(
            $id,
            $request->validated()
        );

        return $this->successResponse(
            $user,
            'User updated successfully.'
        );
    }

    /**
     * Remove the specified user.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->userService->destroy($id);

        return $this->successResponse(
            [],
            'User deleted successfully.'
        );
    }
}