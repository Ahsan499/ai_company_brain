<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends Controller
{
    use ApiResponse;

    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register
     */
    public function register(RegisterRequest $request)
    {
        try {

            $result = $this->authService->register($request->validated());

            return $this->successResponse([
                'user'  => new UserResource($result['user']),
                'token' => $result['token'],
            ], 'User registered successfully.', 201);

        } catch (Throwable $e) {

            return $this->errorResponse(
                $e->getMessage(),
                500
            );

        }
    }

    /**
     * Login
     */
    public function login(LoginRequest $request)
    {
        try {

            $result = $this->authService->login($request->validated());

            return $this->successResponse([
                'user'  => new UserResource($result['user']),
                'token' => $result['token'],
            ], 'Login successful.');

        } catch (Throwable $e) {

            return $this->errorResponse(
                $e->getMessage(),
                401
            );

        }
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request->user());

        return $this->successResponse(
            [],
            'Logout successful.'
        );
    }

    /**
     * Current Authenticated User
     */
    public function me(Request $request)
    {
        $user = $this->authService->me($request->user());

        return $this->successResponse(
            new UserResource($user),
            'Authenticated user.'
        );
    }
}