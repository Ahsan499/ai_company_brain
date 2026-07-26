<?php

namespace App\Models;

use App\Enums\TeamStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
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
                ->orWhere('description', 'like', $term)
                ->orWhereHas('lead', fn (Builder $l) => $l->where('name', 'like', $term))
                ->orWhereHas('department', fn (Builder $d) => $d->where('name', 'like', $term));
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


    protected $fillable = [
        'organization_id',
        'department_id',
        'name',
        'description',
        'status',
        'color',
        'team_lead_id',
    ];

    protected function casts(): array
    {
        return [
            'status' => TeamStatus::class,
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

    public function lead(): BelongsTo
    {
        return $this->belongsTo(User::class, 'team_lead_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class)->withTimestamps();
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class);
    }

    public function timeEntries(): HasMany
    {
        return $this->hasMany(TimeEntry::class);
    }
}
