<?php

namespace App\Services;

use App\Models\File;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class FolderService
{
    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $query = Folder::query()
            ->with(['creator', 'parent'])
            ->withCount(['children', 'files'])
            ->latest('id');

        if (! $actor->hasRole('Super Admin')) {
            $query->where('organization_id', $actor->organization_id);
        } elseif ($orgId = $request->input('organization_id', $request->input('organizationId'))) {
            $query->where('organization_id', $orgId);
        }

        if ($request->filled('parent_id') || $request->filled('parentId')) {
            $parentId = $request->input('parent_id', $request->input('parentId'));
            if ($parentId === 'null' || $parentId === '' || $parentId === 'root') {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $parentId);
            }
        }

        $search = trim((string) ($request->input('search') ?: $request->input('query') ?: ''));
        if ($search !== '') {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    public function show(Folder $folder): Folder
    {
        return $folder->load(['creator', 'parent'])->loadCount(['children', 'files']);
    }

    public function store(array $data, User $actor): Folder
    {
        $orgId = $data['organization_id'] ?? $actor->organization_id;

        if (! empty($data['parent_id'])) {
            $parent = Folder::query()->find($data['parent_id']);
            $orgId = $parent?->organization_id ?? $orgId;
        }

        $folder = Folder::query()->create([
            'organization_id' => $orgId,
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'],
            'created_by' => $actor->id,
        ]);

        return $this->show($folder);
    }

    public function update(Folder $folder, array $data): Folder
    {
        $folder->fill([
            'name' => $data['name'] ?? $folder->name,
            'parent_id' => array_key_exists('parent_id', $data) ? $data['parent_id'] : $folder->parent_id,
        ])->save();

        return $this->show($folder->fresh());
    }

    public function destroy(Folder $folder): void
    {
        $folder->delete();
    }

    /**
     * @return array{folder: Folder, breadcrumb: array<int, array{id:int,name:string}>, folders: \Illuminate\Support\Collection, files: \Illuminate\Support\Collection}
     */
    public function contents(Folder $folder): array
    {
        $folder = $this->show($folder);

        $folders = $folder->children()
            ->with(['creator'])
            ->withCount(['children', 'files'])
            ->orderBy('name')
            ->get();

        $files = $folder->files()
            ->with(['uploader', 'folder', 'project', 'task'])
            ->latest('id')
            ->get();

        return [
            'folder' => $folder,
            'breadcrumb' => $this->breadcrumb($folder),
            'folders' => $folders,
            'files' => $files,
        ];
    }

    /**
     * @return array<int, array{id:int,name:string}>
     */
    public function breadcrumb(Folder $folder): array
    {
        $chain = [];
        $current = $folder;
        $guard = 0;

        while ($current && $guard < 50) {
            array_unshift($chain, [
                'id' => $current->id,
                'name' => $current->name,
            ]);
            $current = $current->parent_id
                ? ($current->relationLoaded('parent') && $current->parent
                    ? $current->parent
                    : Folder::query()->find($current->parent_id))
                : null;
            if ($current && ! $current->relationLoaded('parent')) {
                $current->load('parent');
            }
            $guard++;
        }

        return $chain;
    }
}
