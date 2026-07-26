<?php

namespace App\Policies;

use App\Models\TaskComment;
use App\Models\User;

class TaskCommentPolicy
{
    public function delete(User $user, TaskComment $comment): bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        if ((int) $user->id === (int) $comment->user_id) {
            return true;
        }

        if (! $user->hasAnyRole(['Organization Owner', 'Organization Admin'])) {
            return false;
        }

        $orgId = $comment->task?->organization_id
            ?? $comment->task()->value('organization_id');

        return (int) $user->organization_id === (int) $orgId;
    }
}
