<?php

namespace App\Models;

use App\Enums\Priority;
use App\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        $term = '%'.$search.'%';

        return $query->where(function (Builder $q) use ($term) {
            $q->where('name', 'like', $term)
                ->orWhere('description', 'like', $term);
        });
    }

    public function scopeOrganizationId(Builder $query, mixed $organizationId): Builder
    {
        if ($organizationId === null || $organizationId === '' || $organizationId === 'all') {
            return $query;
        }

        return $query->where('organization_id', $organizationId);
    }

    public function scopeDepartmentId(Builder $query, mixed $departmentId): Builder
    {
        if ($departmentId === null || $departmentId === '' || $departmentId === 'all') {
            return $query;
        }

        return $query->where('department_id', $departmentId);
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

    public function isMember(int $userId): bool
    {
        return $this->members()->where('users.id', $userId)->exists();
    }


    protected $fillable = [
        'organization_id',
        'department_id',
        'name',
        'description',
        'status',
        'priority',
        'progress',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'status' => ProjectStatus::class,
            'priority' => Priority::class,
            'progress' => 'integer',
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

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role_in_project')
            ->withTimestamps();
    }

    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class)->withTimestamps();
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(ProjectMilestone::class)->orderBy('sort_order');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class);
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
