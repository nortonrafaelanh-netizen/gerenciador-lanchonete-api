// @ts-nocheck
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ShoppingCart } from "lucide-react";
import "./OfertasDoDia.css";
// Importamos os dados reais e a lógica de unidade se necessário
import { products } from "../app/data/products";
import { useCart } from "../app/context/CartContext";

const OfertasDoDia: React.FC = () => {
  const navigate = useNavigate();
  const { unidade } = useCart();

  // Filtramos apenas os produtos que possuem preço promocional e estão ativos
  // O useMemo garante que essa filtragem não rode a cada renderização à toa
  const ofertas = useMemo(() => {
    return products
      .filter(
        (p) =>
          p.active !== false && p.originalPrice && p.originalPrice > p.price,
      )
      .slice(0, 3); // Pegamos apenas as 3 principais ofertas para o destaque da Home
  }, []);

  const fallbackImage =
    "https://st4.depositphotos.com/6437402/30960/i/1600/depositphotos_309600474-stock-photo-craft-beef-burger.jpg";

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = fallbackImage;
  };

  if (ofertas.length === 0) return null;

  return (
    <section className="ofertas-section container mx-auto px-4 py-12">
      <div className="ofertas-header flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <span className="text-orange-600 font-black uppercase text-xs tracking-widest mb-1 flex items-center gap-2">
            <Sparkles size={14} /> Economia Real em {unidade}
          </span>
          <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">
            Ofertas <span className="text-orange-600">do Dia</span>
          </h2>
        </div>
        <button
          onClick={() => navigate("/combos")}
          className="ver-todos flex items-center gap-2 text-gray-400 hover:text-orange-600 font-bold uppercase text-xs transition-colors"
        >
          Ver todos os combos <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ofertas.map((produto) => (
          <div
            key={produto.id}
            className="card-produto bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 group hover:translate-y-[-5px] transition-all duration-300"
            onClick={() => navigate(`/product/${produto.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-image-container relative aspect-video overflow-hidden">
              <img
                src={produto.image}
                alt={produto.name}
                onError={handleImageError}
                className="produto-img w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-red-600 text-white font-black px-4 py-1 rounded-full text-xs shadow-lg transform rotate-3">
                OFERTA!
              </div>
            </div>

            <div className="card-content p-6">
              <h3 className="produto-titulo text-2xl font-black text-gray-900 uppercase italic mb-2">
                {produto.name}
              </h3>
              <p className="produto-descricao text-gray-500 text-sm font-medium mb-6 line-clamp-2">
                {produto.description}
              </p>

              <div className="card-footer flex items-center justify-between">
                <div className="preco-container flex flex-col">
                  <span className="preco-antigo text-gray-400 line-through text-xs font-bold">
                    R$ {produto.originalPrice?.toFixed(2)}
                  </span>
                  <span className="preco-atual text-2xl font-black text-orange-600 italic">
                    R$ {produto.price.toFixed(2)}
                  </span>
                </div>
                <button className="btn-adicionar bg-gray-900 text-white p-4 rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-gray-200">
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OfertasDoDia;
