<?php

namespace App\Services;

use App\Enums\Priority;
use App\Enums\TaskStatus;
use App\Models\Project;
use App\Models\Subtask;
use App\Models\Task;
use App\Models\TaskComment;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskService
{
    public function __construct(
        protected ProjectService $projectService,
        protected TaskNotificationDispatcher $taskNotificationDispatcher,
    ) {}

    public function index(Request $request, User $actor): LengthAwarePaginator
    {
        $perPage = min(max((int) $request->integer('per_page', 20), 1), 100);

        $myTasks = $request->input('my_tasks', $request->input('myTasks'));

        $query = Task::query()
            ->with(['project', 'organization', 'department', 'assignee', 'creator', 'subtasks', 'comments.author'])
            ->withCount([
                'subtasks',
                'subtasks as subtasks_done_count' => fn ($q) => $q->where('done', true),
                'comments',
            ])
            ->search($request->string('search')->toString() ?: $request->string('query')->toString())
            ->projectId($request->input('project_id', $request->input('projectId')))
            ->assigneeId($request->input('assignee_id', $request->input('assigneeId')))
            ->status($request->string('status')->toString())
            ->priority($request->string('priority')->toString())
            ->dueDateBetween(
                $request->input('due_date_from', $request->input('dueDateFrom')),
                $request->input('due_date_to', $request->input('dueDateTo'))
            )
            ->myTasks($myTasks, $actor->id)
            ->latest('id');

        if (! $actor->hasRole('Super Admin')) {
            $query->where('organization_id', $actor->organization_id);
        }

        return $query->paginate($perPage);
    }

    public function show(Task $task): Task
    {
        return $task->load([
            'project',
            'organization',
            'department',
            'assignee',
            'creator',
            'subtasks',
            'comments.author',
        ])->loadCount([
            'subtasks',
            'subtasks as subtasks_done_count' => fn ($q) => $q->where('done', true),
            'comments',
        ]);
    }

    public function store(array $data, User $actor): Task
    {
        return DB::transaction(function () use ($data, $actor) {
            $project = Project::query()->findOrFail($data['project_id']);

            $task = Task::query()->create([
                'organization_id' => $data['organization_id'] ?? $project->organization_id,
                'department_id' => $data['department_id'] ?? $project->department_id,
                'project_id' => $project->id,
                'assignee_id' => $data['assignee_id'] ?? null,
                'created_by' => $actor->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'status' => $data['status'] ?? TaskStatus::Todo->value,
                'priority' => $data['priority'] ?? Priority::Medium->value,
                'due_date' => $data['due_date'] ?? null,
            ]);

            $this->projectService->recalculateProgress($project);

            $shown = $this->show($task);
            $this->taskNotificationDispatcher->notifyAssigneeIfNeeded($shown);

            return $shown;
        });
    }

    public function update(Task $task, array $data, ?User $actor = null): Task
    {
        return DB::transaction(function () use ($task, $data, $actor) {
            $previousAssigneeId = $task->assignee_id;
            $previousStatus = $task->status instanceof TaskStatus
                ? $task->status->value
                : (string) $task->status;

            $task->fill([
                'project_id' => $data['project_id'] ?? $task->project_id,
                'organization_id' => $data['organization_id'] ?? $task->organization_id,
                'department_id' => array_key_exists('department_id', $data) ? $data['department_id'] : $task->department_id,
                'assignee_id' => array_key_exists('assignee_id', $data) ? $data['assignee_id'] : $task->assignee_id,
                'title' => $data['title'] ?? $task->title,
                'description' => array_key_exists('description', $data) ? $data['description'] : $task->description,
                'status' => $data['status'] ?? $task->status,
                'priority' => $data['priority'] ?? $task->priority,
                'due_date' => array_key_exists('due_date', $data) ? $data['due_date'] : $task->due_date,
            ])->save();

            if ($task->project) {
                $this->projectService->recalculateProgress($task->project);
            }

            $shown = $this->show($task->fresh());

            if (array_key_exists('assignee_id', $data)) {
                $this->taskNotificationDispatcher->notifyAssigneeIfNeeded($shown, $previousAssigneeId);
            }

            $newStatus = $shown->status instanceof TaskStatus
                ? $shown->status->value
                : (string) $shown->status;

            $this->taskNotificationDispatcher->notifyCompletedIfNeeded(
                $shown,
                $previousStatus,
                $newStatus,
                $actor
            );

            return $shown;
        });
    }

    public function updateStatus(Task $task, string $status, ?User $actor = null): Task
    {
        $previousStatus = $task->status instanceof TaskStatus
            ? $task->status->value
            : (string) $task->status;

        $task->forceFill(['status' => $status])->save();

        if ($task->project) {
            $this->projectService->recalculateProgress($task->project);
        }

        $shown = $this->show($task->fresh());

        $this->taskNotificationDispatcher->notifyCompletedIfNeeded(
            $shown,
            $previousStatus,
            $status,
            $actor
        );

        return $shown;
    }

    public function destroy(Task $task): void
    {
        $project = $task->project;
        $task->delete();
        if ($project) {
            $this->projectService->recalculateProgress($project);
        }
    }

    public function createSubtask(Task $task, array $data): Subtask
    {
        $sort = (int) $task->subtasks()->max('sort_order') + 1;

        return $task->subtasks()->create([
            'title' => $data['title'],
            'done' => (bool) ($data['done'] ?? false),
            'sort_order' => $sort,
        ]);
    }

    public function updateSubtask(Task $task, Subtask $subtask, array $data): Subtask
    {
        abort_unless((int) $subtask->task_id === (int) $task->id, 404);

        $subtask->fill([
            'title' => $data['title'] ?? $subtask->title,
            'done' => array_key_exists('done', $data) ? (bool) $data['done'] : $subtask->done,
        ])->save();

        return $subtask->fresh();
    }

    public function deleteSubtask(Task $task, Subtask $subtask): void
    {
        abort_unless((int) $subtask->task_id === (int) $task->id, 404);
        $subtask->delete();
    }

    public function createComment(Task $task, User $actor, array $data): TaskComment
    {
        return $task->comments()->create([
            'user_id' => $actor->id,
            'body' => $data['body'],
        ])->load('author');
    }

    public function deleteComment(Task $task, TaskComment $comment): void
    {
        abort_unless((int) $comment->task_id === (int) $task->id, 404);
        $comment->delete();
    }
}
