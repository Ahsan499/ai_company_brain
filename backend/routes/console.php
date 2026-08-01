<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('notifications:meeting-reminders')->everyFiveMinutes();
Schedule::command('notifications:weekly-digest')->weeklyOn(1, '08:00');
