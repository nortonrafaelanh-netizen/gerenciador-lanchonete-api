// @ts-nocheck
import { useState, useEffect } from "react";
import { Plus, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  originalPrice?: number;
}

export function ProductCard({ product, originalPrice }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // Resetar o erro se o ID do produto mudar
  useEffect(() => {
    setImageError(false);
  }, [product.id]);

  const imageFallback =
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800";

  const handleNavigateToDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  const isCombo =
    product.category?.toLowerCase() === "combo" ||
    product.name.toLowerCase().includes("combo");

  // Lógica para garantir que a imagem seja atualizada
  // Adicionamos um identificador único na URL para evitar que o navegador use o cache da imagem anterior
  const getImageUrl = () => {
    if (imageError || !product.image) return imageFallback;
    return product.image;
  };

  return (
    <div
      id={product.id}
      onClick={handleNavigateToDetails}
      className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col h-full cursor-pointer relative"
    >
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          // A chave 'key' com o id do produto força o React a destruir e recriar a tag img
          key={product.id}
          src={getImageUrl()}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
        />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {(originalPrice || product.originalPrice) > product.price && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
              OFERTA!
            </div>
          )}

          {isCombo && (
            <div className="bg-yellow-400 text-orange-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
              <Zap size={12} className="fill-orange-900" />
              COMBO
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="font-black text-xl text-gray-800 leading-tight group-hover:text-orange-600 transition-colors uppercase italic tracking-tighter">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            {(originalPrice || product.originalPrice) > product.price && (
              <span className="text-gray-400 line-through text-xs font-bold">
                R$ {(originalPrice || product.originalPrice).toFixed(2)}
              </span>
            )}
            <span className="text-gray-800 font-black text-2xl tracking-tighter italic">
              R$ {product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-orange-600 text-white p-3 md:px-5 md:py-3 rounded-2xl hover:bg-orange-700 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-orange-100 z-10"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="font-black uppercase text-[10px] tracking-widest hidden md:block">
              Adicionar
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
