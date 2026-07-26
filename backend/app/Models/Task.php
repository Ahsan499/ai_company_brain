<?php

namespace App\Models;

use App\Enums\Priority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        $term = '%'.$search.'%';

        return $query->where(function (Builder $q) use ($term) {
            $q->where('title', 'like', $term)
                ->orWhere('description', 'like', $term);
        });
    }

    public function scopeProjectId(Builder $query, mixed $projectId): Builder
    {
        if ($projectId === null || $projectId === '' || $projectId === 'all') {
            return $query;
        }

        return $query->where('project_id', $projectId);
    }

    public function scopeAssigneeId(Builder $query, mixed $assigneeId): Builder
    {
        if ($assigneeId === null || $assigneeId === '' || $assigneeId === 'all') {
            return $query;
        }

        return $query->where('assignee_id', $assigneeId);
    }

    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        if (! $status || $status === 'all') {
            return $query;
        }

        return $query->where('status', $status);
    }

    public function scopePriority(Builder $query, ?string $priority): Builder
    {
        if (! $priority || $priority === 'all') {
            return $query;
        }

        return $query->where('priority', $priority);
    }

    public function scopeDueDateBetween(Builder $query, mixed $from, mixed $to): Builder
    {
        if ($from) {
            $query->whereDate('due_date', '>=', $from);
        }
        if ($to) {
            $query->whereDate('due_date', '<=', $to);
        }

        return $query;
    }

    public function scopeMyTasks(Builder $query, mixed $flag, ?int $userId): Builder
    {
        if (! $flag || in_array($flag, [false, 'false', '0', 0], true) || ! $userId) {
            return $query;
        }

        return $query->where('assignee_id', $userId);
    }

    public function isOverdue(): bool
    {
        if (! $this->due_date) {
            return false;
        }

        $status = $this->status instanceof TaskStatus ? $this->status->value : $this->status;

        return $status !== TaskStatus::Done->value
            && $this->due_date->endOfDay()->isPast();
    }


    protected $fillable = [
        'organization_id',
        'department_id',
        'project_id',
        'assignee_id',
        'created_by',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'status' => TaskStatus::class,
            'priority' => Priority::class,
            'due_date' => 'date',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function subtasks(): HasMany
    {
        return $this->hasMany(Subtask::class)->orderBy('sort_order');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }

    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }
}
