<?php

namespace App\Http\Controllers\Api;

use App\Traits\ApiResponse;
use App\Services\AuthService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Auth Service Instance
     */
    protected AuthService $authService;

    /**
     * Constructor
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register
     */
    public function register(RegisterRequest $request)
    {
        return $this->authService->register($request);
    }

    /**
     * Login
     */
    public function login(LoginRequest $request)
    {
        return $this->authService->login($request);
    }

    /**
     * Logout
     */
    public function logout(Request $request)
    {
        return $this->authService->logout($request->user());
    }

    /**
     * Current User
     */
    public function me(Request $request)
    {
        return $this->authService->me($request->user());
    }
}