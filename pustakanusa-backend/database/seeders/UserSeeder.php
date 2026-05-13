<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin accounts
        $admins = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@pustaka.com',
                'password' => 'admin123',
                'role' => 'admin',
                'nidn' => 'admin',
                'status' => true,
            ],
            [
                'name' => 'Admin Pustaka',
                'email' => 'pustakawan@pustaka.com',
                'password' => 'admin123',
                'role' => 'admin',
                'nidn' => 'pustaka',
                'status' => true,
            ],
        ];

        foreach ($admins as $admin) {
            User::create($admin);
        }

        // Dummy users for testing
        $users = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'password' => 'password123',
                'role' => 'user',
                'nim' => '20241001',
                'status' => true,
            ],
            [
                'name' => 'Siti Aminah',
                'email' => 'siti@example.com',
                'password' => 'password123',
                'role' => 'user',
                'nim' => '20241002',
                'status' => true,
            ],
            [
                'name' => 'Ahmad Hidayat',
                'email' => 'ahmad@example.com',
                'password' => 'password123',
                'role' => 'user',
                'nim' => '20241003',
                'status' => true,
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi@example.com',
                'password' => 'password123',
                'role' => 'user',
                'nim' => '20241004',
                'status' => true,
            ],
            [
                'name' => 'Rizky Pratama',
                'email' => 'rizky@example.com',
                'password' => 'password123',
                'role' => 'user',
                'nim' => '20241005',
                'status' => false,
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        // Generate 15 more random users
        for ($i = 6; $i <= 20; $i++) {
            User::create([
                'name' => 'User Dummy ' . $i,
                'email' => 'user' . $i . '@dummy.com',
                'password' => 'password123',
                'role' => 'user',
                'nim' => '20241' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'status' => (bool)rand(0, 1),
            ]);
        }
    }
}
