<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(protected AuthService $authService) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());
        Auth::login($result['user']);
        $request->session()->regenerate();

        return $this->successResponse([
            'user' => new UserResource($result['user']),
        ], 'User registered successfully.', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        if (! Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ])) {
            return $this->errorResponse('Invalid credentials.', null, 401);
        }

        $request->session()->regenerate();
        $user = $request->user();
        $user?->forceFill(['last_login_at' => now()])->save();

        return $this->successResponse([
            'user' => new UserResource($this->authService->me($user)),
        ], 'Login successful.');
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->successResponse(null, 'Logout successful.');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $this->authService->me($request->user());

        return $this->successResponse(
            new UserResource($user),
            'Authenticated user.'
        );
    }
}
