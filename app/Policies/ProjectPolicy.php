<?php

namespace App\Policies;

use App\Models\User;

class ProjectPolicy
{
    /**
     * Create a new policy instance.
     */
    public function delete(User $user, Project $project)
    {
        // Add your authorization logic here
        // For example:
        return true; // Allow all users to delete for now
        // Or:
        // return $user->id === $project->team_lead;
    }
}
