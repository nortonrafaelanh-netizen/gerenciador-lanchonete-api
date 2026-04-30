// @ts-nocheck
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../app/components/ProductCard";
import { useProducts } from "../app/context/ProductContext";
import { Zap, Utensils, ArrowRight } from "lucide-react";

export function Home() {
  const { products, homeConfig, getDailyOffers } = useProducts();
  const unidadeAtiva = "Rio do Sul";

  // Combos em destaque
  const featuredCombos = useMemo(() => {
    if (homeConfig?.featuredIds?.length > 0) {
      return products.filter((p) => homeConfig.featuredIds.includes(p.id));
    }
    return products.filter((p) => p.category === "combo").slice(0, 2);
  }, [products, homeConfig]);

  // Ofertas do dia — usa getDailyOffers que respeita preços e validade do HomeManager
  const dailyOffers = useMemo(() => getDailyOffers(), [products, homeConfig]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1550547660-d9450f859349?w=1600)",
            filter: "brightness(0.4)",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase italic">
            Tenacious <span className="text-orange-500">Burgers</span>
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 mb-8 font-medium">
            Sabor implacável em{" "}
            <span className="font-bold underline decoration-orange-500">
              {unidadeAtiva}
            </span>
          </p>
          <Link
            to="/burgers"
            className="bg-orange-600 text-white px-10 py-4 rounded-xl font-black hover:bg-orange-700 transition-all shadow-xl hover:-translate-y-1"
          >
            CARDÁPIO COMPLETO
          </Link>
        </div>
      </section>

      {/* BARRA STATUS */}
      <div className="bg-white border-b border-gray-200 py-4 shadow-sm relative z-20">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Cozinha aberta até às 23h
          </div>
          <div className="hidden md:flex gap-6 font-bold text-gray-400">
            <span className="text-orange-600">#TENACIOUSLIFESTYLE</span>
            <span>#BURGERLOVERS</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16">
        {/* COMBOS LEGENDÁRIOS */}
        {featuredCombos.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <Zap className="text-yellow-500 fill-yellow-500" size={32} />
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                  Combos <span className="text-orange-600">Legendários</span>
                </h2>
              </div>
              <Link
                to="/combos"
                className="text-orange-600 font-bold flex items-center gap-2 hover:underline"
              >
                Ver todos <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {featuredCombos.map((combo, index) => (
                <ComboCard key={combo.id} combo={combo} dark={index === 1} />
              ))}
            </div>
          </section>
        )}

        {/* OFERTAS DO DIA */}
        <section className="pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <Utensils className="text-orange-600" size={32} />
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
                Ofertas do <span className="text-orange-600">Dia</span>
              </h2>
            </div>
            <Link
              to="/burgers"
              className="text-orange-600 font-bold flex items-center gap-2 hover:underline"
            >
              Ver todos <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyOffers.length > 0 ? (
              dailyOffers.map((offer) => (
                <ProductCard
                  key={offer.id}
                  product={offer}
                  originalPrice={offer.originalPrice}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-gray-400 font-medium mb-2">
                  Nenhuma oferta ativa para hoje.
                </p>
                <p className="text-gray-300 text-sm">
                  Configure as ofertas no Painel do Franqueado → Aba Home
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ComboCard({ combo, dark = false }) {
  return (
    <div
      className={`rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border-2 transition-all group hover:scale-[1.01] ${
        dark
          ? "bg-gray-900 border-gray-800 text-white"
          : "bg-white border-orange-100 text-gray-900"
      }`}
    >
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <span
          className={`font-bold px-3 py-1 rounded-full text-[10px] w-fit mb-4 uppercase tracking-widest ${
            dark ? "bg-yellow-500 text-black" : "bg-orange-100 text-orange-700"
          }`}
        >
          {dark ? "Destaque da Semana" : "Campeão de Vendas"}
        </span>
        <h3 className="text-3xl font-black mb-2 leading-tight">{combo.name}</h3>
        <p
          className={`${dark ? "text-gray-400" : "text-gray-600"} mb-6 font-medium line-clamp-2`}
        >
          {combo.description}
        </p>
        <div className="flex items-center gap-3 mb-6">
          <span
            className={`text-4xl font-black ${dark ? "text-yellow-500" : "text-orange-600"}`}
          >
            R$ {Number(combo.price).toFixed(2)}
          </span>
          {combo.originalPrice && combo.originalPrice > combo.price && (
            <span className="text-gray-500 line-through font-bold text-lg">
              R$ {Number(combo.originalPrice).toFixed(2)}
            </span>
          )}
        </div>
        <Link
          to={`/product/${combo.id}`}
          className={`w-full text-center font-black py-4 rounded-xl shadow-lg transition-all ${
            dark
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        >
          EU QUERO ESTE COMBO
        </Link>
      </div>
      <div
        className="md:w-1/2 h-64 md:h-auto bg-cover bg-center"
        style={{ backgroundImage: `url(${combo.image})` }}
      />
    </div>
  );
}

export default Home;
