// @ts-nocheck
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Product {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  image_path?: string;
  quantity?: number;
  description?: string;
  category?: string;
  franchiseId?: number | string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  cartCount: number;
  unidade: string;
  setUnidade: (u: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>(() => {
    try {
      const savedCart = localStorage.getItem("@TenaciousBurgers:cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [unidade, setUnidade] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("@TenaciousBurgers:unidade");
      return saved || "Rio do Sul";
    } catch {
      return "Rio do Sul";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("@TenaciousBurgers:cart", JSON.stringify(cart));
    } catch {
      // localStorage indisponível
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("@TenaciousBurgers:unidade", unidade);
    } catch {
      // localStorage indisponível
    }
  }, [unidade]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      // Garante que o ID numérico seja usado para comparação e envio à API
      // IDs como "c1", "b1" viram 1 — produtos distintos colidiam no banco
      const rawId = String(product.id);
      const numericId = parseInt(rawId.replace(/\D/g, ""), 10);
      const normalizedId = isNaN(numericId) ? rawId : numericId;

      const existing = prev.find(
        (item) => String(item.id) === String(normalizedId),
      );

      const normalizedProduct = {
        ...product,
        id: normalizedId, // substitui "c1" por 1, "b2" por 2, etc.
        image_path: product.image_path || product.image,
        image: product.image || product.image_path,
        quantity: product.quantity || 1,
      };

      if (existing) {
        return prev.map((item) =>
          String(item.id) === String(normalizedId)
            ? {
                ...item,
                quantity: (item.quantity || 1) + (product.quantity || 1),
              }
            : item,
        );
      }
      return [...prev, normalizedProduct];
    });
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId) ? { ...item, quantity } : item,
      ),
    );
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prev) =>
      prev.filter((item) => String(item.id) !== String(productId)),
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * (item.quantity || 1),
    0,
  );

  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        cartCount,
        unidade,
        setUnidade,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
}
