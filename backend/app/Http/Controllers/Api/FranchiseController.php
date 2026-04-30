<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Franchise;
use Illuminate\Http\Request;

class FranchiseController extends Controller
{
    // Listar todas as franquias
    public function index()
    {
        return response()->json(Franchise::all());
    }

    // Criar uma nova franquia
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'endereco' => 'required|string',
            'cnpj' => 'required|string|unique:franchises',
        ]);

        $franchise = Franchise::create($validated);

        return response()->json([
            'message' => 'Franquia criada com sucesso!',
            'data' => $franchise
        ], 201);
    }

    // Mostrar uma franquia específica
public function show(Franchise $franchise)
{
    return response()->json($franchise);
}

// Atualizar os dados de uma franquia
public function update(Request $request, Franchise $franchise)
{
    $validated = $request->validate([
        'nome' => 'sometimes|required|string|max:255',
        'endereco' => 'sometimes|required|string',
        'cnpj' => 'sometimes|required|string|unique:franchises,cnpj,' . $franchise->id,
        'ativo' => 'boolean',
    ]);

    $franchise->update($validated);

    return response()->json([
        'message' => 'Franquia atualizada com sucesso!',
        'data' => $franchise
    ]);
}

// Excluir uma franquia
public function destroy(Franchise $franchise)
{
    $franchise->delete();

    return response()->json([
        'message' => 'Franquia removida com sucesso!'
    ], 204); // O status 204 indica que a operação foi concluída sem conteúdo de retorno
}
}