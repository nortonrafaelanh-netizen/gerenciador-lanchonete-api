<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Franchise;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Listar todos os produtos
     */
    public function index(): JsonResponse
    {
        $products = Product::with('franchise')->get();

        return response()->json([
            'message' => 'Produtos listados com sucesso!',
            'data' => $products,
        ]);
    }

    /**
     * Listar produtos de uma franquia específica
     *
     * Ajuste: Adicionada tipagem 'int' para resolver o erro P1132
     */
    public function byFranchise(int $franchiseId): JsonResponse
    {
        $franchise = Franchise::findOrFail($franchiseId);
        $products = $franchise->products()->get();

        return response()->json([
            'message' => 'Produtos da franquia listados com sucesso!',
            'data' => $products,
        ]);
    }

    /**
     * Criar um novo produto
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'franchise_id' => 'required|exists:franchises,id',
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'required|numeric|min:0.01',
            'categoria' => 'required|in:BURGER,BEBIDA,ACOMPANHAMENTO,SOBREMESA',
            'ativo' => 'sometimes|boolean',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Produto criado com sucesso!',
            'data' => $product,
        ], 201);
    }

    /**
     * Obter um produto específico
     *
     * Ajuste: Verificado Route Model Binding para resolver erro P1119
     */
    public function show(Product $product): JsonResponse
    {
        $product->load('franchise');

        return response()->json([
            'message' => 'Produto obtido com sucesso!',
            'data' => $product,
        ]);
    }

    /**
     * Atualizar um produto
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'nome' => 'sometimes|required|string|max:255',
            'descricao' => 'nullable|string',
            'preco' => 'sometimes|required|numeric|min:0.01',
            'categoria' => 'sometimes|required|in:BURGER,BEBIDA,ACOMPANHAMENTO,SOBREMESA',
            'ativo' => 'sometimes|boolean',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Produto atualizado com sucesso!',
            'data' => $product,
        ]);
    }

    /**
     * Deletar um produto
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->forceDelete();

        return response()->json([
            'message' => 'Produto removido com sucesso!',
        ], 200);
    }
}
