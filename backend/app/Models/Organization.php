<?php

namespace App\Models;

use App\Enums\OrganizationPlan;
use App\Enums\OrganizationStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
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
                ->orWhere('industry', 'like', $term)
                ->orWhere('location', 'like', $term)
                ->orWhere('slug', 'like', $term)
                ->orWhereHas('owner', fn (Builder $owner) => $owner->where('name', 'like', $term));
        });
    }

    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        if (! $status || $status === 'all') {
            return $query;
        }

        return $query->where('status', $status);
    }

    public function scopePlan(Builder $query, ?string $plan): Builder
    {
        if (! $plan || $plan === 'all') {
            return $query;
        }

        return $query->where('plan', $plan);
    }


    protected $fillable = [
        'name',
        'slug',
        'industry',
        'size',
        'plan',
        'status',
        'website',
        'location',
        'description',
        'logo',
        'initials',
        'owner_id',
    ];

    protected function casts(): array
    {
        return [
            'plan' => OrganizationPlan::class,
            'status' => OrganizationStatus::class,
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function folders(): HasMany
    {
        return $this->hasMany(Folder::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }
}
