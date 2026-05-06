// @ts-nocheck
import React, { useEffect, useState } from "react";
import { ProductCard } from "../app/components/ProductCard";
import { useCart } from "../app/context/CartContext";
import { Loader2, Utensils, MapPin, Tag, Sparkles, Cherry } from "lucide-react";
// Importação dos dados estáticos sincronizados
import { products, menuPorUnidade } from "../app/data/products";

export function Acompanhamentos() {
  const { unidade } = useCart();
  const [items, setItems] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Pega os IDs permitidos para a unidade
    const produtosPermitidosIds = menuPorUnidade[unidade] ?? [];

    // 2. Filtra pela categoria 'side' e valida o ID na unidade
    let data = products.filter(
      (p) =>
        p.category === "side" &&
        p.active !== false &&
        produtosPermitidosIds.includes(p.id),
    );

    // 3. Fallback: Se vazio, mostra todos os acompanhamentos
    if (data.length === 0) {
      data = products.filter(
        (p) => p.category === "side" && p.active !== false,
      );
    }

    setItems(data);
    setPromocoes(
      data.filter((p) => !!p.originalPrice && p.originalPrice > p.price),
    );

    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, [unidade]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-orange-600" size={48} />
        <p className="text-gray-600 font-bold animate-pulse uppercase tracking-widest text-xs">
          Preparando as porções em {unidade}...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Banner de Marquee */}
      {promocoes.length > 0 && (
        <div className="bg-orange-600 py-3 overflow-hidden border-b border-orange-700">
          <div className="flex whitespace-nowrap animate-marquee items-center gap-10">
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="text-white font-black text-xs uppercase italic flex items-center gap-2"
              >
                <Sparkles size={14} /> Batata, Nuggets e Onion Rings com preço
                especial em {unidade} — Aproveite!
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 mt-8">
        {/* Header Estilizado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-bold uppercase text-xs tracking-[0.3em]">
              <Utensils size={16} /> Para compartilhar (ou não)
            </div>
            <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter">
              Acompanha<span className="text-orange-600">mentos</span>
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              O complemento perfeito para o seu burger em{" "}
              <span className="font-bold text-gray-800">{unidade}</span>
              <MapPin size={16} className="text-orange-500" />
            </p>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 px-6 py-3 rounded-2xl text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">
              Opções
            </p>
            <p className="text-2xl font-black text-orange-600 leading-none">
              {items.length}
            </p>
          </div>
        </div>

        {/* Seção de Promoções */}
        {promocoes.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Tag className="text-orange-600" />
              <h2 className="text-2xl font-black text-gray-800 uppercase italic">
                🔥 Sides em Oferta
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-orange-200 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promocoes.map((side) => (
                <div key={side.id} className="relative group">
                  <div className="absolute -top-3 -right-3 z-10 bg-red-600 text-white font-black px-4 py-1 rounded-full text-xs shadow-lg transform rotate-12 group-hover:scale-110 transition-transform">
                    OFERTA
                  </div>
                  <ProductCard product={side} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cardápio Completo - Grid de 4 colunas como no Figma */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Cherry className="text-gray-400" />
            <h2 className="text-2xl font-black text-gray-800 uppercase italic">
              Menu de Acompanhamentos
            </h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((side) => (
                <ProductCard key={side.id} product={side} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-lg font-bold uppercase tracking-widest">
                Sem acompanhamentos disponíveis hoje em {unidade}.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Acompanhamentos;
