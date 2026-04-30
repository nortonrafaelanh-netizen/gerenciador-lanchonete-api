<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Product;

class Order extends Model
{
    protected $fillable = ['franchise_id', 'user_id', 'numero_pedido', 'status', 'total'];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    /**
     * Um pedido pertence a uma franquia
     */
    public function franchise(): BelongsTo
    {
        return $this->belongsTo(Franchise::class);
    }

    /**
     * Um pedido pertence a um usuário (cliente)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Um pedido pode ter múltiplos produtos
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'order_items')
                    ->withPivot('quantidade', 'preco_unitario', 'subtotal')
                    ->withTimestamps();
    }
}
