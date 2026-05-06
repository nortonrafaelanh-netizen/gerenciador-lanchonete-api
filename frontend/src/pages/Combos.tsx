// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../app/components/ProductCard";
import { useCart } from "../app/context/CartContext";
import { Loader2, Zap, MapPin, Sparkles, Trophy } from "lucide-react";
// Importação dos dados estáticos
import { products, menuPorUnidade } from "../app/data/products";

export function Combos() {
  const { unidade } = useCart();
  const navigate = useNavigate();
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Pega os IDs permitidos para a unidade
    const produtosPermitidosIds = menuPorUnidade[unidade] ?? [];

    // 2. Filtra pela categoria 'combo' e valida o ID na unidade
    let data = products.filter(
      (p) =>
        p.category === "combo" &&
        p.active !== false &&
        produtosPermitidosIds.includes(p.id),
    );

    // 3. Fallback: Se a unidade não tiver combos específicos, mostra os combos gerais
    if (data.length === 0) {
      data = products.filter(
        (p) => p.category === "combo" && p.active !== false,
      );
    }

    setCombos(data);

    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, [unidade]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-orange-600" size={48} />
        <p className="text-gray-600 font-bold animate-pulse uppercase tracking-widest text-xs">
          Turbinando os Combos em {unidade}...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Banner de Impacto Marquee */}
      <div className="bg-yellow-400 py-3 overflow-hidden border-b border-yellow-500">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-10">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="text-black font-black text-xs uppercase italic flex items-center gap-2"
            >
              <Zap size={14} className="fill-black" /> Combos Tenazes: O melhor
              custo-benefício de {unidade} — Fome de Gigante, Preço de Anão!
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* Header Estilizado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-600 font-bold uppercase text-xs tracking-[0.3em]">
              <Trophy size={16} /> A Escolha dos Campeões
            </div>
            <h1 className="text-5xl font-black text-gray-900 uppercase italic tracking-tighter">
              Combos <span className="text-orange-600">Tenazes</span>
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              Economia real para sua fome em{" "}
              <span className="font-bold text-gray-800">{unidade}</span>
              <MapPin size={16} className="text-orange-500" />
            </p>
          </div>

          <div className="bg-orange-600 text-white shadow-xl shadow-orange-200 px-8 py-4 rounded-3xl transform -rotate-2">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">
              Economize até
            </p>
            <p className="text-3xl font-black leading-none">25% OFF</p>
          </div>
        </div>

        {/* Listagem de Combos */}
        <section>
          {combos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {combos.map((combo) => (
                <div key={combo.id} className="relative group">
                  <div className="absolute -top-4 left-6 z-10 bg-yellow-400 text-black font-black px-6 py-2 rounded-full text-xs shadow-xl flex items-center gap-2 group-hover:scale-110 transition-transform">
                    <Sparkles size={14} /> SUPER COMBO
                  </div>
                  <ProductCard product={combo} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-400 text-lg font-bold uppercase tracking-widest">
                Nenhum combo disponível para {unidade} no momento.
              </p>
            </div>
          )}
        </section>

        {/* Footer de Chamada */}
        <div className="mt-20 bg-gray-900 rounded-[2.5rem] p-10 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black uppercase italic mb-4">
              Monte seu próprio combo!
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Adicione um Burger, uma Batata e uma Bebida ao carrinho e ganhe
              descontos progressivos.
            </p>
          </div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 w-64 h-64" />
        </div>
      </div>
    </div>
  );
}

export default Combos;
