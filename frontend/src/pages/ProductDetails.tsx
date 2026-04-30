// @ts-nocheck
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Clock,
  Flame,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useCart } from "../app/context/CartContext";
import { products, dailyOffers, promoCombos } from "../app/data/products";

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, user } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const fallbackImg =
    "https://st4.depositphotos.com/6437402/30960/i/1600/depositphotos_309600474-stock-photo-craft-beef-burger.jpg";

  const product = useMemo(() => {
    const allProducts = [...products, ...dailyOffers, ...promoCombos];
    const deduped = new Map(allProducts.map((p) => [String(p.id), p]));
    return deduped.get(String(id));
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
        <h2 className="text-2xl font-black text-gray-800 uppercase italic">
          Produto não encontrado!
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black mt-4 uppercase flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Ver Cardápio
        </button>
      </div>
    );
  }

  const isCombo = String(id).startsWith("c");

  const handleAddToCartAndNavigate = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart({ ...product, quantity });
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-orange-600 font-black uppercase text-[10px] tracking-[0.2em]"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden bg-white shadow-2xl border-[12px] border-white">
            <img
              src={imgError ? fallbackImg : product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase italic tracking-tighter">
            {product.name}
          </h1>

          {/* Listagem de itens se for COMBO */}
          {isCombo && (
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl mb-8">
              <h3 className="text-orange-800 font-black uppercase text-sm mb-4 flex items-center gap-2">
                <Star size={16} className="fill-orange-800" /> Itens deste
                combo:
              </h3>
              <ul className="grid grid-cols-1 gap-2">
                {product.description.split("+").map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-orange-900 font-bold"
                  >
                    <CheckCircle2 size={18} className="text-orange-600" />{" "}
                    {item.trim()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4 mb-10">
            <p className="text-gray-600 text-xl leading-relaxed font-medium">
              {isCombo
                ? "Aproveite nossa experiência completa: "
                : "Feito com carinho: "}
              <span className="text-gray-900 font-bold">
                {product.description}
              </span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-orange-50 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">
                Preço Especial
              </p>
              {product.originalPrice && (
                <p className="text-gray-400 line-through text-sm font-bold">
                  R$ {product.originalPrice.toFixed(2)}
                </p>
              )}
              <p className="text-4xl font-black text-orange-600 italic tracking-tighter">
                R$ {product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-100">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-orange-600 shadow-sm"
              >
                <Minus size={20} />
              </button>
              <span className="font-black text-2xl px-6 text-gray-800">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-orange-600 shadow-sm"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              onClick={handleAddToCartAndNavigate}
              className="w-full sm:w-auto bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase flex items-center justify-center gap-3 hover:bg-orange-700 transition-all shadow-xl italic"
            >
              <ShoppingCart size={24} strokeWidth={3} />{" "}
              {isCombo ? "Garantir Combo" : "Adicionar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
