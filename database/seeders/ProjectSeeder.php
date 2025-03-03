<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $maxTeamMembers = min(3, $users->count()); // Limit team members to maximum of 3 or total users, whichever is smaller

        // Create 4 sample projects
        for ($i = 1; $i <= 4; $i++) {
            $project = Project::create([
                'title' => "Sample Project {$i}",
                'description' => "This is a detailed description for sample project {$i}. It includes multiple features and objectives.",
                'priority' => $this->getRandomPriority(),
                'status' => $this->getRandomStatus(),
                'deadline' => now()->addDays(rand(1, 30)),
                'privacy' => $i <= 2 ? 'Public' : 'Private', // First 2 projects public, rest private
                'category' => $this->getRandomCategory(),
                'skills' => $this->getRandomSkills(),
                'team_lead' => $users->random()->name,
                'thumbnail' => null, // You can add default thumbnails if needed
                'team_members' => $users->random(rand(1, $maxTeamMembers))->pluck('id')->toArray(),
                'attached_files' => null,
                'user_id' => $users->random()->id,
            ]);

            // Create project team members relationships
            foreach ($project->team_members as $userId) {
                $project->users()->attach($userId);
            }
        }
    }

    private function getRandomPriority(): string
    {
        return collect(['High', 'Medium', 'Low'])->random();
    }

    private function getRandomStatus(): string
    {
        return collect(['In Progress', 'Completed'])->random();
    }

    private function getRandomPrivacy(): string
    {
        return collect(['Public', 'Private', 'Team Only'])->random();
    }

    private function getRandomCategory(): string
    {
        return collect([
            'Web Development',
            'Mobile Development',
            'UI/UX Design',
            'Database',
            'DevOps',
            'Security',
            'Testing'
        ])->random();
    }

    private function getRandomSkills(): array
    {
        $skills = [
            'PHP',
            'Laravel',
            'Vue.js',
            'React',
            'JavaScript',
            'Python',
            'Java',
            'Docker',
            'AWS',
            'MySQL',
            'MongoDB',
            'Node.js',
            'TypeScript',
            'Git',
            'CI/CD'
        ];

        return collect($skills)->random(rand(3, 6))->values()->toArray();
    }
}
