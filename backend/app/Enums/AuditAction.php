<?php

namespace App\Enums;

enum AuditAction: string
{
    case Create = 'create';
    case Update = 'update';
    case Delete = 'delete';
    case Login = 'login';
    case PermissionChange = 'permission_change';
    case Invite = 'invite';
    case Remove = 'remove';
}
