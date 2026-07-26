<?php

namespace Database\Seeders\Support;

/**
 * Maps frontend string IDs (org-nova, usr-ahsan, …) → DB integer PKs.
 */
class IdMap
{
    /** @var array<string, int> */
    public static array $organizations = [];

    /** @var array<string, int> */
    public static array $users = [];

    /** @var array<string, int> */
    public static array $departments = [];

    /** @var array<string, int> */
    public static array $teams = [];

    /** @var array<string, int> */
    public static array $projects = [];

    /** @var array<string, int> */
    public static array $tasks = [];

    /** @var array<string, int> */
    public static array $meetings = [];

    /** @var array<string, int> */
    public static array $folders = [];

    /** @var array<string, int> */
    public static array $files = [];

    public static function userId(?string $frontendId): ?int
    {
        if (! $frontendId) {
            return null;
        }

        return self::$users[$frontendId] ?? null;
    }

    public static function orgId(?string $frontendId): ?int
    {
        if (! $frontendId) {
            return null;
        }

        return self::$organizations[$frontendId] ?? null;
    }

    public static function deptId(?string $frontendId): ?int
    {
        if (! $frontendId) {
            return null;
        }

        return self::$departments[$frontendId] ?? null;
    }

    public static function teamId(?string $frontendId): ?int
    {
        if (! $frontendId) {
            return null;
        }

        return self::$teams[$frontendId] ?? null;
    }

    public static function projectId(?string $frontendId): ?int
    {
        if (! $frontendId) {
            return null;
        }

        return self::$projects[$frontendId] ?? null;
    }

    public static function taskId(?string $frontendId): ?int
    {
        if (! $frontendId) {
            return null;
        }

        return self::$tasks[$frontendId] ?? null;
    }

    public static function folderId(?string $frontendId): ?int
    {
        if (! $frontendId) {
            return null;
        }

        return self::$folders[$frontendId] ?? null;
    }

    public static function findUserIdByName(?string $name): ?int
    {
        if (! $name) {
            return null;
        }

        foreach (FrontendDump::get('USERS') as $user) {
            if (($user['name'] ?? null) === $name) {
                return self::userId($user['id'] ?? null);
            }
        }

        return null;
    }

    public static function findUserIdByEmail(?string $email): ?int
    {
        if (! $email) {
            return null;
        }

        foreach (FrontendDump::get('USERS') as $user) {
            if (($user['email'] ?? null) === $email) {
                return self::userId($user['id'] ?? null);
            }
        }

        // Ahsan may be remapped to ahsan@example.com
        if ($email === 'ahsan@novatech.io') {
            return self::userId('usr-ahsan');
        }

        return null;
    }
}
