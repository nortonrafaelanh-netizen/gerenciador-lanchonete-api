<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FranchiseController;
use App\Http\Controllers\Api\HomeConfigController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rotas Públicas
|--------------------------------------------------------------------------
*/

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/home-data', function () {
    return response()->json([
        'combos' => Product::query()->where('categoria', 'BURGER')->orWhere('categoria', 'COMBO')->take(2)->get(),
        'offers' => Product::query()->where('ativo', true)->take(4)->get(),
    ]);
});

Route::get('/produtos', [ProductController::class, 'index']);
Route::get('/franchise/{franchise}/home-config', [HomeConfigController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Rotas Protegidas (Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Autenticação
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Franquias
    Route::apiResource('franquias', FranchiseController::class);

    // Produtos
    Route::apiResource('produtos', ProductController::class)->except(['index']);
    Route::get('/franquias/{franchiseId}/produtos', [ProductController::class, 'byFranchise']);

    // Pedidos
    Route::apiResource('pedidos', OrderController::class);
    Route::get('/franquias/{franchiseId}/pedidos', [OrderController::class, 'byFranchise']);
    Route::get('/meus-pedidos', [OrderController::class, 'myOrders']);

    /*
    |--------------------------------------------------------------------------
    | Configuração da Home (HomeManager do React)
    |--------------------------------------------------------------------------
    */
    Route::prefix('franchise/{franchise}')->group(function () {
        // Rota para Atualizar a Configuração (POST)
        Route::post('/home-config', [HomeConfigController::class, 'update']);
    });

});