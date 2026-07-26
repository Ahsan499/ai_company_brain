<?php

namespace App\Services;

use App\Enums\FileType;
use App\Models\File;
use App\Models\Folder;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileService
{
    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $query = File::query()
            ->with(['uploader', 'folder', 'project', 'task'])
            ->latest('id');

        if (! $actor->hasRole('Super Admin')) {
            $query->where('organization_id', $actor->organization_id);
        } elseif ($orgId = $request->input('organization_id', $request->input('organizationId'))) {
            $query->where('organization_id', $orgId);
        }

        if ($folderId = $request->input('folder_id', $request->input('folderId'))) {
            $query->where('folder_id', $folderId);
        }

        if ($projectId = $request->input('project_id', $request->input('projectId'))) {
            $query->where('project_id', $projectId);
        }

        if ($taskId = $request->input('task_id', $request->input('taskId'))) {
            $query->where('task_id', $taskId);
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        $search = trim((string) ($request->input('search') ?: $request->input('query') ?: ''));
        if ($search !== '') {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->paginate($perPage);
    }

    public function show(File $file): File
    {
        return $file->load(['uploader', 'folder', 'project', 'task']);
    }

    public function store(array $data, User $actor, ?UploadedFile $upload = null): File
    {
        $orgId = $data['organization_id'] ?? $actor->organization_id;

        if (! empty($data['folder_id'])) {
            $orgId = Folder::query()->find($data['folder_id'])?->organization_id ?? $orgId;
        } elseif (! empty($data['project_id'])) {
            $orgId = Project::query()->find($data['project_id'])?->organization_id ?? $orgId;
        } elseif (! empty($data['task_id'])) {
            $orgId = Task::query()->find($data['task_id'])?->organization_id ?? $orgId;
        }

        if (! $upload) {
            throw ValidationException::withMessages([
                'file' => ['A file upload is required.'],
            ]);
        }

        $originalName = $data['name'] ?? $upload->getClientOriginalName();
        $mime = $upload->getMimeType() ?: 'application/octet-stream';
        $type = $this->resolveType($mime, $originalName);
        $storedPath = $upload->store('uploads/'.date('Y/m'), 'local');

        $file = File::query()->create([
            'organization_id' => $orgId,
            'folder_id' => $data['folder_id'] ?? null,
            'project_id' => $data['project_id'] ?? null,
            'task_id' => $data['task_id'] ?? null,
            'uploaded_by' => $actor->id,
            'name' => $originalName,
            'type' => $type->value,
            'mime_label' => $data['mime_label'] ?? $this->mimeLabel($mime, $type),
            'path' => $storedPath,
            'size_bytes' => $upload->getSize() ?: 0,
            'versions' => [
                [
                    'id' => 'v1',
                    'label' => 'v1',
                    'userId' => $actor->id,
                    'userName' => $actor->name,
                    'time' => now()->toIso8601String(),
                ],
            ],
            'comments' => [],
        ]);

        return $this->show($file);
    }

    public function update(File $file, array $data, ?UploadedFile $upload = null): File
    {
        if ($upload) {
            if ($file->path && Storage::disk('local')->exists($file->path)) {
                Storage::disk('local')->delete($file->path);
            }

            $storedPath = $upload->store('uploads/'.date('Y/m'), 'local');
            $mime = $upload->getMimeType() ?: 'application/octet-stream';
            $type = $this->resolveType($mime, $upload->getClientOriginalName());
            $versions = $file->versions ?? [];
            $next = count($versions) + 1;
            $versions[] = [
                'id' => 'v'.$next,
                'label' => 'v'.$next,
                'userId' => auth()->id(),
                'userName' => auth()->user()?->name,
                'time' => now()->toIso8601String(),
            ];

            $file->fill([
                'path' => $storedPath,
                'size_bytes' => $upload->getSize() ?: 0,
                'type' => $type->value,
                'mime_label' => $this->mimeLabel($mime, $type),
                'versions' => $versions,
            ]);
        }

        $file->fill([
            'name' => $data['name'] ?? $file->name,
            'folder_id' => array_key_exists('folder_id', $data) ? $data['folder_id'] : $file->folder_id,
            'project_id' => array_key_exists('project_id', $data) ? $data['project_id'] : $file->project_id,
            'task_id' => array_key_exists('task_id', $data) ? $data['task_id'] : $file->task_id,
            'type' => $data['type'] ?? $file->type,
            'mime_label' => $data['mime_label'] ?? $file->mime_label,
        ])->save();

        return $this->show($file->fresh());
    }

    public function destroy(File $file): void
    {
        if ($file->path && Storage::disk('local')->exists($file->path)) {
            Storage::disk('local')->delete($file->path);
        }

        $file->delete();
    }

    public function download(File $file): StreamedResponse
    {
        if (! $file->path || ! Storage::disk('local')->exists($file->path)) {
            abort(404, 'File content not found on disk.');
        }

        return Storage::disk('local')->download($file->path, $file->name);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function comments(File $file): array
    {
        return array_values($file->comments ?? []);
    }

    /**
     * @return array<string, mixed>
     */
    public function addComment(File $file, User $actor, string $text): array
    {
        $comments = $file->comments ?? [];
        $comment = [
            'id' => 'c-'.Str::lower(Str::random(8)),
            'userId' => $actor->id,
            'userName' => $actor->name,
            'initials' => $actor->initials,
            'text' => $text,
            'time' => 'just now',
            'createdAt' => now()->toIso8601String(),
        ];
        $comments[] = $comment;
        $file->comments = $comments;
        $file->save();

        return $comment;
    }

    public function forProject(Project $project, Request $request): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        return $project->files()
            ->with(['uploader', 'folder', 'project', 'task'])
            ->latest('id')
            ->paginate($perPage);
    }

    public function forTask(Task $task, Request $request): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        return $task->files()
            ->with(['uploader', 'folder', 'project', 'task'])
            ->latest('id')
            ->paginate($perPage);
    }

    protected function resolveType(string $mime, string $filename): FileType
    {
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        if (str_contains($mime, 'pdf') || $ext === 'pdf') {
            return FileType::Pdf;
        }
        if (str_starts_with($mime, 'image/') || in_array($ext, ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'], true)) {
            return FileType::Image;
        }
        if (in_array($ext, ['xls', 'xlsx', 'csv', 'ods'], true) || str_contains($mime, 'spreadsheet') || str_contains($mime, 'excel')) {
            return FileType::Spreadsheet;
        }
        if (in_array($ext, ['doc', 'docx', 'odt', 'rtf', 'txt', 'md'], true) || str_contains($mime, 'word') || str_contains($mime, 'text')) {
            return FileType::Doc;
        }
        if (in_array($ext, ['js', 'ts', 'tsx', 'jsx', 'php', 'py', 'go', 'java', 'rb', 'json', 'yml', 'yaml', 'xml', 'html', 'css'], true)) {
            return FileType::Code;
        }

        return FileType::Other;
    }

    protected function mimeLabel(string $mime, FileType $type): string
    {
        return match ($type) {
            FileType::Pdf => 'PDF Document',
            FileType::Image => 'Image',
            FileType::Spreadsheet => 'Spreadsheet',
            FileType::Doc => 'Document',
            FileType::Code => 'Code',
            FileType::Other => $mime,
        };
    }
}
