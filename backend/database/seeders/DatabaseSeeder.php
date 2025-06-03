<?php

namespace Database\Seeders;

use App\Models\BirthCareSubscription;
use App\Models\Permission;
use App\Models\SubscriptionPlan;
use App\Models\SystemRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed System Roles
        $roles = [
            ['id' => 1, 'name' => 'admin'],
            ['id' => 2, 'name' => 'owner'],
            ['id' => 3, 'name' => 'staff'],
        ];

        foreach ($roles as $role) {
            SystemRole::updateOrCreate(
                ['id' => $role['id']],
                ['name' => $role['name'], 'created_at' => now(), 'updated_at' => now()]
            );
        }

        // Seed Subscription Plans
        $plans = [
            [
                'plan_name' => 'Standard',
                'price' => 199.99,
                'duration_in_year' => 1,
                'description' => 'Standard plan with additional features for medium-sized facilities.',
            ],
            [
                'plan_name' => 'Premium',
                'price' => 299.99,
                'duration_in_year' => 2,
                'description' => 'Premium plan with full features for large facilities.',
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['plan_name' => $plan['plan_name']],
                [
                    'price' => $plan['price'],
                    'duration_in_year' => $plan['duration_in_year'],
                    'description' => $plan['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // Seed Permissions
        $permissions = [
            'manage_staff',
            'manage_role',
            'manage_appointment',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission],
                ['name' => $permission]
            );
        }

        // Seed Users and Subscriptions
        $users = [
            [
                'firstname' => 'Admin',
                'middlename' => null,
                'lastname' => 'User',
                'contact_number' => '1234567890',
                'address' => '123 Admin Street',
                'email' => 'admin@example.com',
                'password' => Hash::make('123123123'),
                'status' => 'active',
                'system_role_id' => 1,
                'email_verified_at' => now(),
            ],
            [
                'firstname' => 'Owner',
                'middlename' => 'A',
                'lastname' => 'Doe',
                'contact_number' => '0987654321',
                'address' => '456 User Road',
                'email' => 'owner@example.com',
                'password' => Hash::make('123123123'),
                'status' => 'active',
                'system_role_id' => 2,
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            // Create or update the user
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );

            // Create a subscription for the user with system_role_id = 2
            if ($user->system_role_id === 2) {
                $plan = SubscriptionPlan::where('plan_name', 'Standard')->first();
                if ($plan) {
                    BirthCareSubscription::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'plan_id' => $plan->id,
                        ],
                        [
                            'start_date' => now(),
                            'end_date' => now()->addYears($plan->duration_in_year),
                            'status' => 'active',
                        ]
                    );
                } 
            }
        }
    }
}