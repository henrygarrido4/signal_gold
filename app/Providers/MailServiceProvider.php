<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;

class MailServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Blade::componentNamespace('Illuminate\\Mail\\Resources\\Views\\Components', 'mail');
    }
} 