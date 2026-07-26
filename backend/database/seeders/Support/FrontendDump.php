<?php

namespace Database\Seeders\Support;

class FrontendDump
{
    private static ?array $data = null;

    public static function all(): array
    {
        if (self::$data === null) {
            $path = database_path('seeders/data/frontend_dump.json');
            self::$data = json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        }

        return self::$data;
    }

    public static function get(string $key): array
    {
        return self::all()[$key] ?? [];
    }
}
