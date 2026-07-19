<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;

class AuthService
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request)
    {
        //
    }

    /**
     * Login user.
     */
    public function login(LoginRequest $request)
    {
        //
    }

    /**
     * Logout authenticated user.
     */
    public function logout(User $user)
    {
        //
    }

    /**
     * Get authenticated user.
     */
    public function me(User $user)
    {
        //
    }
}