<?php

namespace App\Http\Resources\File;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $comments = $this->comments ?? [];
        $sizeBytes = (int) $this->size_bytes;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type?->value ?? $this->type,
            'mimeLabel' => $this->mime_label,
            'sizeBytes' => $sizeBytes,
            'sizeLabel' => $this->formatSize($sizeBytes),
            'path' => $this->path,
            'folderId' => $this->folder_id,
            'folder' => $this->whenLoaded('folder', function () {
                if (! $this->folder) {
                    return null;
                }

                return [
                    'id' => $this->folder->id,
                    'name' => $this->folder->name,
                ];
            }),
            'projectId' => $this->project_id,
            'projectName' => $this->whenLoaded('project', fn () => $this->project?->name),
            'project' => $this->whenLoaded('project', function () {
                if (! $this->project) {
                    return null;
                }

                return [
                    'id' => $this->project->id,
                    'name' => $this->project->name,
                ];
            }),
            'taskId' => $this->task_id,
            'taskTitle' => $this->whenLoaded('task', fn () => $this->task?->title),
            'task' => $this->whenLoaded('task', function () {
                if (! $this->task) {
                    return null;
                }

                return [
                    'id' => $this->task->id,
                    'name' => $this->task->title,
                    'title' => $this->task->title,
                ];
            }),
            'uploadedById' => $this->uploaded_by,
            'uploadedByName' => $this->whenLoaded('uploader', fn () => $this->uploader?->name),
            'uploadedByInitials' => $this->whenLoaded('uploader', fn () => $this->uploader?->initials),
            'uploadedBy' => $this->whenLoaded('uploader', function () {
                if (! $this->uploader) {
                    return null;
                }

                return [
                    'id' => $this->uploader->id,
                    'name' => $this->uploader->name,
                    'initials' => $this->uploader->initials,
                ];
            }),
            'uploadedAt' => optional($this->created_at)?->toDateString(),
            'modifiedAt' => optional($this->updated_at)?->toDateString(),
            'versionHistory' => $this->versions ?? [],
            'versions' => $this->versions ?? [],
            'commentCount' => is_array($comments) ? count($comments) : 0,
            'comments' => $comments,
            'organizationId' => $this->organization_id,
        ];
    }

    protected function formatSize(int $bytes): string
    {
        if ($bytes < 1024) {
            return $bytes.' B';
        }
        if ($bytes < 1048576) {
            return round($bytes / 1024).' KB';
        }

        return round($bytes / 1048576, 1).' MB';
    }
}
