<?php

namespace Database\Seeders;

use App\Enums\FileType;
use App\Models\File;
use App\Models\Folder;
use Carbon\Carbon;
use Database\Seeders\Support\FrontendDump;
use Database\Seeders\Support\IdMap;
use Illuminate\Database\Seeder;

class FolderAndFileSeeder extends Seeder
{
    public function run(): void
    {
        $folders = FrontendDump::get('FOLDERS');

        // Parents first (null parentId), then children
        usort($folders, function (array $a, array $b) {
            $ap = $a['parentId'] === null ? 0 : 1;
            $bp = $b['parentId'] === null ? 0 : 1;

            return $ap <=> $bp;
        });

        foreach ($folders as $row) {
            // Infer organization from creator's org, default Nova
            $creatorId = IdMap::userId($row['createdById'] ?? null);
            $orgId = \App\Models\User::query()->find($creatorId)?->organization_id
                ?? IdMap::orgId('org-nova');

            $folder = Folder::query()->create([
                'organization_id' => $orgId,
                'parent_id' => IdMap::folderId($row['parentId'] ?? null),
                'name' => $row['name'],
                'created_by' => $creatorId,
                'created_at' => isset($row['createdAt']) ? Carbon::parse($row['createdAt'])->startOfDay() : now(),
                'updated_at' => now(),
            ]);

            IdMap::$folders[$row['id']] = $folder->id;
        }

        // Second pass for any child that was created before parent (safety)
        foreach ($folders as $row) {
            if (empty($row['parentId'])) {
                continue;
            }
            $folderId = IdMap::folderId($row['id']);
            $parentId = IdMap::folderId($row['parentId']);
            if ($folderId && $parentId) {
                Folder::query()->whereKey($folderId)->update(['parent_id' => $parentId]);
            }
        }

        foreach (FrontendDump::get('FILES') as $row) {
            $uploaderId = IdMap::userId($row['uploadedById']);
            $orgId = \App\Models\User::query()->find($uploaderId)?->organization_id
                ?? IdMap::orgId('org-nova');

            $file = File::query()->create([
                'organization_id' => $orgId,
                'folder_id' => IdMap::folderId($row['folderId'] ?? null),
                'project_id' => IdMap::projectId($row['projectId'] ?? null),
                'task_id' => IdMap::taskId($row['taskId'] ?? null),
                'uploaded_by' => $uploaderId,
                'name' => $row['name'],
                'type' => FileType::from($row['type'] ?? 'other'),
                'mime_label' => $row['mimeLabel'] ?? null,
                'path' => null,
                'size_bytes' => (int) ($row['sizeBytes'] ?? 0),
                'versions' => $row['versions'] ?? null,
                'comments' => $row['comments'] ?? null,
                'created_at' => isset($row['uploadedAt']) ? Carbon::parse($row['uploadedAt'])->startOfDay() : now(),
                'updated_at' => isset($row['modifiedAt']) ? Carbon::parse($row['modifiedAt'])->startOfDay() : now(),
            ]);

            IdMap::$files[$row['id']] = $file->id;
        }
    }
}
