// @ts-nocheck
import React, { useEffect, useState } from "react";
import { ProductCard } from "../app/components/ProductCard";
import { useCart } from "../app/context/CartContext";
import { LucideBeef, Loader2, MapPin, Tag, Sparkles } from "lucide-react";
import { products, menuPorUnidade } from "../app/data/products";

export function Burgers() {
  const { unidade } = useCart();
  const [burgers, setBurgers] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const produtosPermitidosIds = menuPorUnidade[unidade] ?? [];

    let data = products.filter(
      (p) =>
        p.category === "burger" &&
        p.active !== false &&
        produtosPermitidosIds.includes(p.id),
    );

    if (data.length === 0) {
      data = products.filter(
        (p) => p.category === "burger" && p.active !== false,
      );
    }

    setBurgers(data);
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
          Sincronizando Cardápio de {unidade}...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {promocoes.length > 0 && (
        <div className="bg-orange-600 py-3 overflow-hidden border-b border-orange-700">
          <div className="flex whitespace-nowrap animate-marquee items-center gap-10">
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="text-white font-black text-xs uppercase italic flex items-center gap-2"
              >
                <Sparkles size={14} /> Ofertas Exclusivas em {unidade} —
                Descontos de até 30% — Aproveite!
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-bold uppercase text-xs tracking-[0.3em]">
              <LucideBeef size={16} /> O Verdadeiro Smash
            </div>
            <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter">
              Nossos <span className="text-orange-600">Burgers</span>
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              Grelhados no fogo, servidos em{" "}
              <span className="font-bold text-gray-800">{unidade}</span>
              <MapPin size={16} className="text-orange-500" />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white shadow-sm border border-gray-200 px-6 py-3 rounded-2xl text-center">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">
                Disponíveis
              </p>
              <p className="text-2xl font-black text-orange-600 leading-none">
                {burgers.length}
              </p>
            </div>
          </div>
        </div>

        {promocoes.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Tag className="text-orange-600" />
              <h2 className="text-2xl font-black text-gray-800 uppercase italic">
                🔥 Promoções do Dia
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-orange-200 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promocoes.map((burger) => (
                <div key={burger.id} className="relative group">
                  <div className="absolute -top-3 -right-3 z-10 bg-red-600 text-white font-black px-4 py-1 rounded-full text-xs shadow-lg transform rotate-12 group-hover:scale-110 transition-transform">
                    OFERTA
                  </div>
                  <ProductCard product={burger} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-3 mb-8">
            <LucideBeef className="text-gray-400" />
            <h2 className="text-2xl font-black text-gray-800 uppercase italic">
              Todos os Burgers
            </h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
          </div>

          {burgers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {burgers.map((burger) => (
                <ProductCard key={burger.id} product={burger} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <LucideBeef size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg font-bold uppercase tracking-widest">
                Cardápio em atualização para {unidade}.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Burgers;
