<?php

namespace App\Services;

use App\Enums\UserStatus;
use App\Models\User;
use App\Support\RoleLabel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AuthService
{
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $user = User::query()->create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'initials' => $this->initialsFromName($data['name']),
                'status' => UserStatus::Active,
                'email_verified_at' => now(),
            ]);

            $user->assignRole(RoleLabel::toSpatie('Employee'));

            return [
                'user' => $user->load(['roles', 'permissions', 'organization', 'department']),
            ];
        });
    }

    public function login(array $data): array
    {
        $user = User::query()->where('email', $data['email'])->first();

        if (! $user || ! password_verify($data['password'], $user->getAuthPassword())) {
            throw new \RuntimeException('Invalid credentials.');
        }

        $user->forceFill(['last_login_at' => now()])->save();

        $token = $user->createToken('api')->plainTextToken;

        return [
            'user' => $user->load(['roles', 'permissions', 'organization', 'department']),
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    public function me(User $user): User
    {
        return $user->load(['roles', 'permissions', 'organization', 'department']);
    }

    private function initialsFromName(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];
        $initials = collect($parts)
            ->filter()
            ->take(2)
            ->map(fn ($p) => Str::upper(Str::substr($p, 0, 1)))
            ->implode('');

        return $initials !== '' ? $initials : 'U';
    }
}
