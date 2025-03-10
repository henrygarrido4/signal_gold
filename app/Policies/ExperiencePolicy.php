<?php

namespace App\Policies;

use App\Models\Experience;
use App\Models\User;

class ExperiencePolicy
{
    public function update(User $user, Experience $experience)
    {
        return $user->id === $experience->user_id;
    }

    public function delete(User $user, Experience $experience)
    {
        return $user->id === $experience->user_id;
    }
}
