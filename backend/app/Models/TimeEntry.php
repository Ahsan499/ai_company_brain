<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimeEntry extends Model
{
    use HasFactory;

    public function scopeUserId(Builder $query, mixed $userId): Builder
    {
        if ($userId === null || $userId === '' || $userId === 'all') {
            return $query;
        }

        return $query->where('user_id', $userId);
    }

    public function scopeTaskId(Builder $query, mixed $taskId): Builder
    {
        if ($taskId === null || $taskId === '' || $taskId === 'all') {
            return $query;
        }

        return $query->where('task_id', $taskId);
    }

    public function scopeProjectId(Builder $query, mixed $projectId): Builder
    {
        if ($projectId === null || $projectId === '' || $projectId === 'all') {
            return $query;
        }

        return $query->where('project_id', $projectId);
    }

    public function scopeTeamId(Builder $query, mixed $teamId): Builder
    {
        if ($teamId === null || $teamId === '' || $teamId === 'all') {
            return $query;
        }

        return $query->where('team_id', $teamId);
    }

    public function scopeDateBetween(Builder $query, mixed $from, mixed $to): Builder
    {
        if ($from) {
            $query->whereDate('date', '>=', $from);
        }
        if ($to) {
            $query->whereDate('date', '<=', $to);
        }

        return $query;
    }

    public function scopeBillable(Builder $query, mixed $billable): Builder
    {
        if ($billable === null || $billable === '' || $billable === 'all') {
            return $query;
        }

        $value = filter_var($billable, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($value === null) {
            return $query;
        }

        return $query->where('billable', $value);
    }


    protected $fillable = [
        'user_id',
        'task_id',
        'project_id',
        'team_id',
        'date',
        'duration_minutes',
        'note',
        'billable',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'duration_minutes' => 'integer',
            'billable' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }
}
