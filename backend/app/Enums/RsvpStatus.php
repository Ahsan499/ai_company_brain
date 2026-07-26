<?php

namespace App\Enums;

enum RsvpStatus: string
{
    case Accepted = 'accepted';
    case Pending = 'pending';
    case Declined = 'declined';
}
