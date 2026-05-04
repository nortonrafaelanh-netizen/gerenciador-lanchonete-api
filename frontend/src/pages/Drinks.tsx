// @ts-nocheck
import React, { useEffect, useState } from "react";
import { ProductCard } from "../app/components/ProductCard";
import { useProducts } from "../app/context/ProductContext";
import { useCart } from "../app/context/CartContext";
import { Loader2, CupSoda, MapPin, Tag, Sparkles, Waves } from "lucide-react";

export function Drinks() {
  const { unidade } = useCart();
  const { products, loading: productsLoading } = useProducts();
  const [items, setItems] = useState([]);
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let data = products.filter(
      (p) =>
        p.category === "drink" &&
        p.active !== false &&
        String(p.franchiseName).toLowerCase() === unidade.toLowerCase(),
    );

    if (data.length === 0) {
      data = products.filter(
        (p) => p.category === "drink" && p.active !== false,
      );
    }

    setItems(data);
    setPromocoes(
      data.filter((p) => !!p.originalPrice && p.originalPrice > p.price),
    );
  }, [products, unidade]);

  useEffect(() => {
    if (!productsLoading) {
      const timer = setTimeout(() => setLoading(false), 250);
      return () => clearTimeout(timer);
    }
  }, [productsLoading]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-orange-600" size={48} />
        <p className="text-gray-600 font-bold animate-pulse uppercase tracking-widest text-xs">
          Gelando as bebidas em {unidade}...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Banner de Promoções Dinâmico para Bebidas */}
      {promocoes.length > 0 && (
        <div className="bg-blue-600 py-3 overflow-hidden border-b border-blue-700">
          <div className="flex whitespace-nowrap animate-marquee items-center gap-10">
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="text-white font-black text-xs uppercase italic flex items-center gap-2"
              >
                <Sparkles size={14} /> Refresque sua sede em {unidade} — Bebidas
                geladas com desconto progressivo!
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 mt-8">
        {/* Header Estilizado Drinks */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-bold uppercase text-xs tracking-[0.3em]">
              <Waves size={16} /> Always Ice Cold
            </div>
            <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter">
              Bebidas & <span className="text-blue-600">Drinks</span>
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              Sodas, Sucos e Cervejas em{" "}
              <span className="font-bold text-gray-800">{unidade}</span>
              <MapPin size={16} className="text-blue-500" />
            </p>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 px-6 py-3 rounded-2xl text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">
              Disponíveis
            </p>
            <p className="text-2xl font-black text-blue-600 leading-none">
              {items.length}
            </p>
          </div>
        </div>

        {/* Seção de Promoções (Happy Hour) */}
        {promocoes.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Tag className="text-blue-600" />
              <h2 className="text-2xl font-black text-gray-800 uppercase italic">
                🔥 Happy Hour {unidade}
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-200 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promocoes.map((drink) => (
                <div key={drink.id} className="relative group">
                  <div className="absolute -top-3 -right-3 z-10 bg-blue-600 text-white font-black px-4 py-1 rounded-full text-xs shadow-lg transform rotate-12 group-hover:scale-110 transition-transform">
                    GELADA
                  </div>
                  <ProductCard product={drink} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Listagem Geral de Bebidas */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <CupSoda className="text-gray-400" />
            <h2 className="text-2xl font-black text-gray-800 uppercase italic">
              Menu de Bebidas
            </h2>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((drink) => (
                <ProductCard key={drink.id} product={drink} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CupSoda size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg font-bold uppercase tracking-widest">
                O estoque de bebidas de {unidade} está sendo reposto.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Drinks;
