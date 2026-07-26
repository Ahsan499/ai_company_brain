<?php

namespace App\Models;

use App\Enums\DepartmentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
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
                ->orWhereHas('manager', fn (Builder $m) => $m->where('name', 'like', $term));
        });
    }

    public function scopeOrganizationId(Builder $query, mixed $organizationId): Builder
    {
        if ($organizationId === null || $organizationId === '' || $organizationId === 'all') {
            return $query;
        }

        return $query->where('organization_id', $organizationId);
    }

    public function scopeManagerId(Builder $query, mixed $managerId): Builder
    {
        if ($managerId === null || $managerId === '' || $managerId === 'all') {
            return $query;
        }

        return $query->where('manager_id', $managerId);
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
        'name',
        'description',
        'status',
        'manager_id',
        'avg_tenure_months',
    ];

    protected function casts(): array
    {
        return [
            'status' => DepartmentStatus::class,
            'avg_tenure_months' => 'integer',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
