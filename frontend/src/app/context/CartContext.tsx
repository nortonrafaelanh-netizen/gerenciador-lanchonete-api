import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "../types/product";

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  cartCount: number;
  unidade: string;
  setUnidade: (u: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Inicializa o estado com dados do localStorage para não perder o carrinho no F5
  const [cart, setCart] = useState<Product[]>(() => {
    const savedCart = localStorage.getItem("@TenaciousBurgers:cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Salva no localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem("@TenaciousBurgers:cart", JSON.stringify(cart));
  }, [cart]);

  // Unidade (franquia) selecionada globalmente
  const [unidade, setUnidade] = useState<string>(() => {
    const saved = localStorage.getItem("@TenaciousBurgers:unidade");
    return saved || "Rio do Sul";
  });

  useEffect(() => {
    localStorage.setItem("@TenaciousBurgers:unidade", unidade);
  }, [unidade]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
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
