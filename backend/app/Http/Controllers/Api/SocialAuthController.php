<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\RoleLabel;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class SocialAuthController extends Controller
{
    use ApiResponse;

    /** @var list<string> */
    private const PROVIDERS = ['google', 'microsoft'];

    public function redirect(string $provider): JsonResponse
    {
        if (! in_array($provider, self::PROVIDERS, true)) {
            abort(404);
        }

        $url = Socialite::driver($provider)
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return $this->successResponse(['url' => $url], 'OAuth redirect URL.');
    }

    public function callback(string $provider): RedirectResponse
    {
        $frontend = rtrim((string) config('services.frontend.url', 'http://localhost:5173'), '/');
        $failure = $frontend.'/auth?error=oauth_failed';

        if (! in_array($provider, self::PROVIDERS, true)) {
            return redirect()->away($failure);
        }

        try {
            $oauthUser = Socialite::driver($provider)->stateless()->user();
            $user = $this->findOrCreateFromOAuth($provider, $oauthUser);

            Auth::login($user, true);
            request()->session()->regenerate();

            $user->forceFill(['last_login_at' => now()])->save();

            return redirect()->away($frontend.'/dashboard');
        } catch (Throwable $e) {
            Log::warning('OAuth callback failed', [
                'provider' => $provider,
                'message' => $e->getMessage(),
            ]);

            return redirect()->away($failure);
        }
    }

    private function findOrCreateFromOAuth(string $provider, object $oauthUser): User
    {
        $providerId = (string) $oauthUser->getId();
        $email = strtolower(trim((string) ($oauthUser->getEmail() ?? '')));
        $name = trim((string) ($oauthUser->getName() ?: $oauthUser->getNickname() ?: 'User'));
        $avatar = $oauthUser->getAvatar();

        $idColumn = $provider === 'google' ? 'google_id' : 'microsoft_id';

        return DB::transaction(function () use ($provider, $providerId, $email, $name, $avatar, $idColumn) {
            // 1) Match by provider ID
            $user = User::query()->where($idColumn, $providerId)->first();

            // 2) Match by email (link OAuth to existing password account)
            if (! $user && $email !== '') {
                $user = User::query()->where('email', $email)->first();
            }

            if ($user) {
                $updates = [
                    $idColumn => $providerId,
                    'last_login_at' => now(),
                ];
                if ($avatar && ! $user->avatar_url) {
                    $updates['avatar_url'] = $avatar;
                }
                if (! $user->email_verified_at) {
                    $updates['email_verified_at'] = now();
                }
                $user->forceFill($updates)->save();

                return $user->fresh();
            }

            if ($email === '') {
                throw new \RuntimeException("{$provider} account did not return an email address.");
            }

            $user = User::query()->create([
                'name' => $name !== '' ? $name : 'User',
                'email' => $email,
                'password' => null,
                $idColumn => $providerId,
                'avatar_url' => $avatar,
                'initials' => $this->initialsFromName($name),
                'status' => UserStatus::Active,
                'email_verified_at' => now(),
                'last_login_at' => now(),
            ]);

            $user->assignRole(RoleLabel::toSpatie('Employee'));

            return $user;
        });
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
