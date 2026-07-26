<?php

namespace App\Http\Resources\Folder;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FolderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'organizationId' => $this->organization_id,
            'parentId' => $this->parent_id,
            'parent' => $this->whenLoaded('parent', function () {
                if (! $this->parent) {
                    return null;
                }

                return [
                    'id' => $this->parent->id,
                    'name' => $this->parent->name,
                ];
            }),
            'createdById' => $this->created_by,
            'createdByName' => $this->whenLoaded('creator', fn () => $this->creator?->name),
            'createdBy' => $this->whenLoaded('creator', function () {
                if (! $this->creator) {
                    return null;
                }

                return [
                    'id' => $this->creator->id,
                    'name' => $this->creator->name,
                    'initials' => $this->creator->initials,
                ];
            }),
            'createdAt' => optional($this->created_at)?->toDateString(),
            'childrenCount' => (int) ($this->children_count ?? 0),
            'filesCount' => (int) ($this->files_count ?? 0),
        ];
    }
}
