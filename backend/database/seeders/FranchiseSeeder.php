<?php

namespace Database\Seeders;

use App\Models\Franchise;
use Illuminate\Database\Seeder;

class FranchiseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Franchise::updateOrCreate(
            ['id' => 1],
            [
                'nome' => 'Rio do Sul',
                'endereco' => 'Rua Principal, 123 - Rio do Sul, SC',
                'cnpj' => '12345678000195',
                'ativo' => true,
            ]
        );

        Franchise::updateOrCreate(
            ['id' => 2],
            [
                'nome' => 'Atalanta',
                'endereco' => 'Avenida Central, 456 - Atalanta, SC',
                'cnpj' => '12345678000196',
                'ativo' => true,
            ]
        );

        Franchise::updateOrCreate(
            ['id' => 3],
            [
                'nome' => 'Ituporanga',
                'endereco' => 'Rua do Comércio, 789 - Ituporanga, SC',
                'cnpj' => '12345678000197',
                'ativo' => true,
            ]
        );
    }
}
