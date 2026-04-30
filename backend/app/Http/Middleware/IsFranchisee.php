<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsFranchisee
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next)
{
    if ($request->user() && $request->user()->role === 'franchisee') {
        return $next($request);
    }
    return response()->json(['message' => 'Acesso negado. Apenas franqueados.'], 403);
}
}
