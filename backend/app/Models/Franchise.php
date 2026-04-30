<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Product;

class Franchise extends Model
{
    protected $fillable = ['nome', 'endereco', 'cnpj', 'ativo'];

    protected $casts = [
        'ativo' => 'boolean',
    ];

    /**
     * Uma franquia pode ter múltiplos produtos
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Uma franquia pode ter múltiplos pedidos
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
