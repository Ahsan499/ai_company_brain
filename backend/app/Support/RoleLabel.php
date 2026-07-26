<?php

namespace App\Support;

class RoleLabel
{
    /** Frontend label => Spatie role name */
    public const TO_SPATIE = [
        'Super Admin' => 'Super Admin',
        'Org Owner' => 'Organization Owner',
        'Org Admin' => 'Organization Admin',
        'Dept Manager' => 'Department Manager',
        'Team Lead' => 'Team Lead',
        'Employee' => 'Employee',
        'HR' => 'HR',
        'Guest' => 'Guest',
        // Already Spatie names
        'Organization Owner' => 'Organization Owner',
        'Organization Admin' => 'Organization Admin',
        'Department Manager' => 'Department Manager',
    ];

    /** Spatie role name => Frontend label */
    public const TO_FRONTEND = [
        'Super Admin' => 'Super Admin',
        'Organization Owner' => 'Org Owner',
        'Organization Admin' => 'Org Admin',
        'Department Manager' => 'Dept Manager',
        'Team Lead' => 'Team Lead',
        'Employee' => 'Employee',
        'HR' => 'HR',
        'Guest' => 'Guest',
    ];

    public static function toSpatie(?string $label): ?string
    {
        if ($label === null || $label === '') {
            return null;
        }

        return self::TO_SPATIE[$label] ?? $label;
    }

    public static function toFrontend(?string $spatieName): ?string
    {
        if ($spatieName === null || $spatieName === '') {
            return null;
        }

        return self::TO_FRONTEND[$spatieName] ?? $spatieName;
    }

    /** @return list<string> */
    public static function frontendLabels(): array
    {
        return [
            'Super Admin',
            'Org Owner',
            'Org Admin',
            'Dept Manager',
            'Team Lead',
            'Employee',
            'HR',
            'Guest',
        ];
    }
}
