<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // BURGERS
        Product::updateOrCreate(
            ['id' => 1],
            [
                'franchise_id' => 1,
                'nome' => 'Classic Burger',
                'descricao' => 'Hambúrguer artesanal 180g, queijo cheddar, alface, tomate e molho especial',
                'preco' => 18.90,
                'categoria' => 'BURGER',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 2],
            [
                'franchise_id' => 1,
                'nome' => 'Bacon Deluxe',
                'descricao' => 'Duplo hambúrguer, bacon crocante, cheddar, cebola caramelizada',
                'preco' => 24.90,
                'categoria' => 'BURGER',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 3],
            [
                'franchise_id' => 1,
                'nome' => 'Mushroom Swiss',
                'descricao' => 'Hambúrguer premium, queijo suíço, cogumelos salteados, rúcula',
                'preco' => 26.90,
                'categoria' => 'BURGER',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 4],
            [
                'franchise_id' => 1,
                'nome' => 'Monster Tenacious',
                'descricao' => 'Triplo burger, triplo cheddar, ovo, bacon e picles artesanal',
                'preco' => 38.90,
                'categoria' => 'BURGER',
                'ativo' => true,
            ]
        );

        // DOGS
        Product::updateOrCreate(
            ['id' => 5],
            [
                'franchise_id' => 1,
                'nome' => 'Hot Dog Tradicional',
                'descricao' => 'Salsicha premium, purê, batata palha, milho, ervilha e molhos',
                'preco' => 12.90,
                'categoria' => 'DOG',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 6],
            [
                'franchise_id' => 1,
                'nome' => 'Hot Dog Especial',
                'descricao' => 'Salsicha artesanal, catupiry, bacon, cheddar e batata palha',
                'preco' => 16.90,
                'categoria' => 'DOG',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 7],
            [
                'franchise_id' => 1,
                'nome' => 'Hot Dog Completo',
                'descricao' => 'Dupla salsicha, purê, bacon, catupiry, cheddar, todos os molhos',
                'preco' => 19.90,
                'categoria' => 'DOG',
                'ativo' => true,
            ]
        );

        // ACOMPANHAMENTOS
        Product::updateOrCreate(
            ['id' => 8],
            [
                'franchise_id' => 1,
                'nome' => 'Batata Frita',
                'descricao' => 'Batata frita crocante sequinha',
                'preco' => 9.90,
                'categoria' => 'ACOMPANHAMENTO',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 9],
            [
                'franchise_id' => 1,
                'nome' => 'Onion Rings',
                'descricao' => 'Anéis de cebola empanados e fritos',
                'preco' => 11.90,
                'categoria' => 'ACOMPANHAMENTO',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 10],
            [
                'franchise_id' => 1,
                'nome' => 'Nuggets',
                'descricao' => '10 unidades de nuggets crocantes',
                'preco' => 13.90,
                'categoria' => 'ACOMPANHAMENTO',
                'ativo' => true,
            ]
        );

        // BEBIDAS
        Product::updateOrCreate(
            ['id' => 11],
            [
                'franchise_id' => 1,
                'nome' => 'Refrigerante Lata',
                'descricao' => 'Refrigerante lata 350ml (Cola, Guaraná, Limão ou Laranja)',
                'preco' => 5.00,
                'categoria' => 'BEBIDA',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 12],
            [
                'franchise_id' => 1,
                'nome' => 'Suco Natural',
                'descricao' => 'Suco natural feito na hora, escolha entre laranja ou maracujá',
                'preco' => 8.90,
                'categoria' => 'BEBIDA',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 13],
            [
                'franchise_id' => 1,
                'nome' => 'Cerveja Long Neck',
                'descricao' => 'Cerveja gelada Long Neck para acompanhar seu pedido',
                'preco' => 11.90,
                'categoria' => 'BEBIDA',
                'ativo' => true,
            ]
        );

        // COMBOS
        Product::updateOrCreate(
            ['id' => 14],
            [
                'franchise_id' => 1,
                'nome' => 'Combo Catarinense',
                'descricao' => '2 Classic Burgers + Batata G + Refri 2L',
                'preco' => 79.90,
                'categoria' => 'COMBO',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 15],
            [
                'franchise_id' => 1,
                'nome' => 'Dupla Tenacious',
                'descricao' => '2 Monster Tenacious pelo preço especial',
                'preco' => 45.90,
                'categoria' => 'COMBO',
                'ativo' => true,
            ]
        );

        Product::updateOrCreate(
            ['id' => 16],
            [
                'franchise_id' => 1,
                'nome' => 'Combo Família',
                'descricao' => '4 Burgers sortidos + 2 Refris 2L + Batata XXG',
                'preco' => 139.90,
                'categoria' => 'COMBO',
                'ativo' => true,
            ]
        );
    }
}
