<?php

namespace App\Providers;

use App\Models\Organization;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Observers\AuditableObserver;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use SocialiteProviders\Manager\SocialiteWasCalled;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        User::observe(AuditableObserver::class);
        Organization::observe(AuditableObserver::class);
        Project::observe(AuditableObserver::class);
        Task::observe(AuditableObserver::class);

        if (class_exists(SocialiteWasCalled::class)) {
            Event::listen(function (SocialiteWasCalled $event): void {
                $event->extendSocialite('microsoft', \SocialiteProviders\Microsoft\Provider::class);
            });
        }
    }
}
