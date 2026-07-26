<?php

namespace App\Enums;

enum OrganizationPlan: string
{
    case Starter = 'starter';
    case Growth = 'growth';
    case Enterprise = 'enterprise';
    case Scale = 'scale';
}
