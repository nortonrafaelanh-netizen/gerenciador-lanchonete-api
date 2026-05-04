<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Franchise;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    /**
     * Listar todos os pedidos
     */
    public function index(): JsonResponse
    {
        $orders = Order::with(['franchise', 'user', 'products'])->get();

        return response()->json([
            'message' => 'Pedidos listados com sucesso!',
            'data' => $orders
        ]);
    }

    /**
     * Listar pedidos de uma franquia específica
     */
    public function byFranchise($franchiseId): JsonResponse
    {
        $franchise = Franchise::findOrFail($franchiseId);
        $orders = $franchise->orders()->with(['user', 'products'])->get();

        return response()->json([
            'message' => 'Pedidos da franquia listados com sucesso!',
            'data' => $orders
        ]);
    }

    /**
     * Listar pedidos do usuário autenticado
     */
    public function myOrders(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()->with(['franchise', 'products'])->get();

        return response()->json([
            'message' => 'Seus pedidos foram listados com sucesso!',
            'data' => $orders
        ]);
    }

    /**
     * Criar um novo pedido
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'franchise_id' => 'required|integer|exists:franchises,id',
            'numero_pedido' => 'required|string|unique:orders',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|integer|exists:products,id',
            'products.*.quantidade' => 'required|integer|min:1',
        ]);

        // Criar o pedido
        $order = Order::create([
            'franchise_id' => $validated['franchise_id'],
            'user_id' => $request->user()->id,
            'numero_pedido' => $validated['numero_pedido'],
            'status' => 'PENDENTE',
            'total' => 0,
        ]);

        $total = 0;

        // Adicionar produtos ao pedido
        foreach ($validated['products'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $quantidade = $item['quantidade'];
            $subtotal = $product->preco * $quantidade;

            $order->products()->attach($product->id, [
                'quantidade' => $quantidade,
                'preco_unitario' => $product->preco,
                'subtotal' => $subtotal,
            ]);

            $total += $subtotal;
        }

        // Atualizar o total do pedido
        $order->update(['total' => $total]);
        $order->load(['franchise', 'user', 'products']);

        return response()->json([
            'message' => 'Pedido criado com sucesso!',
            'data' => $order
        ], 201);
    }

    /**
     * Obter um pedido específico
     */
    public function show(Order $order): JsonResponse
    {
        $order->load(['franchise', 'user', 'products']);

        return response()->json([
            'message' => 'Pedido obtido com sucesso!',
            'data' => $order
        ]);
    }

    /**
     * Atualizar status de um pedido
     */
    public function update(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:PENDENTE,PREPARANDO,PRONTO,ENTREGUE,CANCELADO',
        ]);

        $order->update($validated);

        return response()->json([
            'message' => 'Pedido atualizado com sucesso!',
            'data' => $order
        ]);
    }

    /**
     * Cancelar um pedido
     */
    public function destroy(Order $order): JsonResponse
    {
        $order->update(['status' => 'CANCELADO']);

        return response()->json([
            'message' => 'Pedido cancelado com sucesso!'
        ], 204);
    }
}
