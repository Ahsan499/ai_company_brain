<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'department_id',
        'project_id',
        'assigned_to',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'is_active',
    ];

    protected $casts = [
        'due_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Task belongs to Organization.
     */
    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Task belongs to Department.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Task belongs to Project.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Assigned User.
     */
    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}