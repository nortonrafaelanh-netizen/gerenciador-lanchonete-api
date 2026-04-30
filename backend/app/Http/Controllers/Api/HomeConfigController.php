<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class HomeConfigController extends Controller
{
    /**
     * Obter configuração da Home
     *
     * @param int $franchiseId
     */
    public function show(int $franchise): JsonResponse
    {
        if (! Schema::hasTable('home_configs')) {
            return response()->json([
                'daily_offers_ids' => [],
                'offers_data' => new \stdClass,
            ]);
        }

        // Busca a config no banco ou retorna o padrão se não existir
        $config = DB::table('home_configs')->where('franchise_id', $franchise)->first();

        if (! $config) {
            return response()->json([
                'daily_offers_ids' => [],
                'offers_data' => new \stdClass,
            ]);
        }

        return response()->json([
            'dailyOffersIds' => json_decode($config->daily_offers_ids),
            'offersData' => json_decode($config->offers_data),
        ]);
    }

    /**
     * Atualizar configuração da Home
     * Integrado para aceitar camelCase do React (HomeManager.tsx)
     *
     * @param Request $request
     * @param int $franchiseId
     */
    public function update(Request $request, int $franchise): JsonResponse
    {
        // Aceita as duas variações de nomes para evitar erros de validação no CRUD
        $dailyOffers = $request->input('daily_offers_ids') ?? $request->input('dailyOffersIds');
        $offersData = $request->input('offers_data') ?? $request->input('offersData');

        if (! Schema::hasTable('home_configs')) {
            return response()->json([
                'error' => 'Tabela home_configs não existe. Execute php artisan migrate.',
            ], 500);
        }

        // Validação manual ou via request para garantir dados íntegros
        if (!is_array($dailyOffers) || !is_array($offersData)) {
            return response()->json(['error' => 'Os dados de ofertas devem ser arrays.'], 422);
        }

        DB::table('home_configs')->updateOrInsert(
            ['franchise_id' => $franchise],
            [
                'daily_offers_ids' => json_encode($dailyOffers),
                'offers_data' => json_encode($offersData),
                'updated_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Configuração atualizada com sucesso',
            'status' => 'success'
        ]);
    }
}