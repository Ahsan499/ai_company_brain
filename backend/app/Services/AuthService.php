<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Register a new user.
     */
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {

            $user = User::create([
                'first_name' => $data['first_name'],
                'last_name'  => $data['last_name'],
                'email'      => $data['email'],
                'password'   => Hash::make($data['password']),
            ]);

            // Assign default role
            $user->assignRole('Employee');

            // Generate Sanctum Token
            $token = $user->createToken('API Token')->plainTextToken;

            return [
                'user'  => $user->load('roles'),
                'token' => $token,
            ];
        });
    }

    /**
     * Login user.
     */
    public function login(array $data): array
    {
        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw new \Exception('Invalid credentials.');
        }

        // Remove old tokens (optional)
        $user->tokens()->delete();

        $token = $user->createToken('API Token')->plainTextToken;

        return [
            'user'  => $user->load('roles'),
            'token' => $token,
        ];
    }

    /**
     * Logout user.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    /**
     * Authenticated user.
     */
    public function me(User $user): User
    {
        return $user->load('roles');
    }
}