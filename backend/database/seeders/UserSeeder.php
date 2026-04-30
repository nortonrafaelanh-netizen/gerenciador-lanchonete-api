<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Usuário Franqueado
        User::firstOrCreate(
            ['email' => 'franqueado@tenacious.com'],
            [
                'name' => 'Franqueado Teste',
                'password' => Hash::make('123456'),
                'role' => 'FRANQUEADO',
            ]
        );

        // Usuário Cliente
        User::firstOrCreate(
            ['email' => 'cliente@tenacious.com'],
            [
                'name' => 'Cliente Teste',
                'password' => Hash::make('123456'),
                'role' => 'CLIENTE',
            ]
        );

        // Admin (também Franqueado)
        User::firstOrCreate(
            ['email' => 'admin@tenacious.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('123456'),
                'role' => 'FRANQUEADO',
            ]
        );
    }
}
