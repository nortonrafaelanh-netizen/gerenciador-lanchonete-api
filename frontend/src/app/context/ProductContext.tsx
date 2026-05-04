import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../../services/api";
import { products as sampleProducts } from "../data/products";
import { Product } from "../types/product";
import { useAuth } from "./AuthContext";

interface HomeConfig {
  dailyOffersIds: string[];
  featuredIds?: string[];
  bannerUrl?: string;
  offersData?: Record<
    string,
    {
      price?: number;
      originalPrice?: number;
      activeFrom?: string;
      activeTo?: string;
    }
  >;
}

interface ProductContextData {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  homeConfig: HomeConfig;
  setHomeConfig: React.Dispatch<React.SetStateAction<HomeConfig>>;
  updateProduct: (updated: Product) => Promise<void>;
  createProduct: (product: Product) => Promise<Product>;
  getDailyOffers: () => (Product & { originalPrice: number })[];
  saveHomeConfig: (config: HomeConfig) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextData | undefined>(undefined);

const DEFAULT_HOME_CONFIG: HomeConfig = {
  dailyOffersIds: [],
  featuredIds: [],
  offersData: {},
};

// URL base da sua API Laravel (ajuste conforme seu ambiente)
const API_URL = "http://localhost:8000/api";
// ID da franquia (pode ser dinâmico futuramente)
const FRANCHISE_ID = 1;

const normalizeCategory = (category: any) => {
  if (!category) return "";
  const value = String(category).trim().toLowerCase();
  if (
    ["burger", "burgers", "hamburger", "hambúrguer", "hamburguer"].includes(
      value,
    )
  )
    return "burger";
  if (["dog", "dogs", "hot dog", "hotdog"].includes(value)) return "dog";
  if (["bebida", "bebidas", "drink", "drinks"].includes(value)) return "drink";
  if (["acompanhamento", "acompanhamentos", "side", "sides"].includes(value))
    return "side";
  if (["combo", "combos"].includes(value)) return "combo";
  if (["sobremesa", "dessert", "desserts"].includes(value)) return "dessert";
  return value;
};

const normalizeProduct = (product: any): Product => ({
  id: String(product.id ?? product._id ?? ""),
  name: product.nome ?? product.name ?? "",
  description: product.descricao ?? product.description ?? "",
  category: normalizeCategory(product.categoria ?? product.category ?? ""),
  price: Number(product.preco ?? product.price ?? 0),
  originalPrice:
    product.original_price !== undefined
      ? Number(product.original_price)
      : product.originalPrice !== undefined
        ? Number(product.originalPrice)
        : undefined,
  image:
    product.image ??
    product.foto ??
    product.photo ??
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800",
  quantity: product.quantity ?? 0,
  isOffer: product.is_offer ?? false,
  active: product.ativo ?? product.active ?? true,
  franchiseId: String(
    product.franchise_id ?? product.franchise?.id ?? product.franchiseId ?? "",
  ),
  franchiseName:
    product.franchise?.nome ??
    product.franchise?.name ??
    product.franchiseName ??
    product.franchise_name ??
    "",
});

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [homeConfig, setHomeConfig] = useState<HomeConfig>(DEFAULT_HOME_CONFIG);
  const [loading, setLoading] = useState(true);

  // ID da franquia baseado no usuário logado (fallback para 1)
  // TODO: Implementar lógica para obter o ID da franquia do usuário/franquia atual
  // Por enquanto, usa 1 como padrão para franqueados
  const franchiseId = user?.role === "FRANQUEADO" ? 1 : 1;

  // Busca inicial de dados do Laravel/PostgreSQL
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Busca produtos e configurações em paralelo
      const [productsRes, configRes] = await Promise.all([
        api.get("/produtos"),
        api.get(`/franchise/${franchiseId}/home-config`),
      ]);

      if (productsRes.status === 200) {
        const productsData = productsRes.data;
        const rawProducts = productsData.data || productsData || [];
        const normalizedProducts = Array.isArray(rawProducts)
          ? rawProducts.map(normalizeProduct)
          : sampleProducts.map(normalizeProduct);
        setProducts(normalizedProducts);
      } else {
        console.error(
          `Erro ao buscar produtos: ${productsRes.status} ${productsRes.statusText}`,
        );
        setProducts(sampleProducts.map(normalizeProduct));
      }

      if (configRes.status === 200) {
        const configData = configRes.data;
        setHomeConfig(configData.data || configData || DEFAULT_HOME_CONFIG);
      } else {
        console.error(
          `Erro ao buscar home-config: ${configRes.status} ${configRes.statusText}`,
        );
      }
    } catch (error) {
      console.error("Erro ao carregar dados da API:", error);
      setProducts(sampleProducts.map(normalizeProduct));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Atualiza um produto individualmente na API e no estado
  const updateProduct = async (updated: Product) => {
    try {
      const response = await api.put(`/produtos/${updated.id}`, {
        nome: updated.name,
        descricao: updated.description,
        preco: updated.price,
        categoria:
          updated.category === "burger"
            ? "BURGER"
            : updated.category === "drink"
              ? "BEBIDA"
              : updated.category === "side"
                ? "ACOMPANHAMENTO"
                : updated.category === "combo"
                  ? "COMBO"
                  : (updated.category?.toUpperCase() ?? updated.category),
        ativo: updated.active,
      });

      const responseData = response.data;
      const normalizedProduct = normalizeProduct(responseData.data || updated);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === normalizedProduct.id ? normalizedProduct : p,
        ),
      );
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p)),
      );
    }
  };

  const createProduct = async (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: product.id || `prod_${Date.now()}`,
      franchiseId: String(franchiseId),
    };

    try {
      const response = await api.post("/produtos", {
        franchise_id: franchiseId,
        nome: newProduct.name,
        descricao: newProduct.description,
        preco: newProduct.price,
        categoria:
          newProduct.category === "burger"
            ? "BURGER"
            : newProduct.category === "drink"
              ? "BEBIDA"
              : newProduct.category === "side"
                ? "ACOMPANHAMENTO"
                : newProduct.category === "combo"
                  ? "COMBO"
                  : (newProduct.category?.toUpperCase() ?? newProduct.category),
        ativo: newProduct.active ?? true,
      });

      const responseData = response.data;
      const normalizedProduct = normalizeProduct(
        responseData.data || newProduct,
      );
      setProducts((prev) => [...prev, normalizedProduct]);
      return normalizedProduct;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    }
  };

  // Salva a configuração da Home (Ofertas do Dia) no Banco de Dados
  const saveHomeConfig = async (config: HomeConfig) => {
    try {
      await api.post(`/franchise/${franchiseId}/home-config`, {
        daily_offers_ids: config.dailyOffersIds,
        offers_data: config.offersData,
      });

      setHomeConfig(config);
    } catch (error) {
      console.error("Erro ao salvar HomeConfig:", error);
      throw error;
    }
  };

  const getDailyOffers = () => {
    const today = new Date().toISOString().split("T")[0];

    if (homeConfig.dailyOffersIds?.length > 0) {
      return homeConfig.dailyOffersIds
        .map((id) => {
          const product = products.find((p) => String(p.id) === String(id));
          if (!product) return null;

          const offerData = homeConfig.offersData?.[id] ?? {};

          if (offerData.activeTo && offerData.activeTo < today) return null;
          if (offerData.activeFrom && offerData.activeFrom > today) return null;

          return {
            ...product,
            price: offerData.price ?? product.price,
            originalPrice:
              offerData.originalPrice ?? product.originalPrice ?? product.price,
          };
        })
        .filter(Boolean) as (Product & { originalPrice: number })[];
    }

    const fallbackOffers = products.filter((p) => {
      if (p.isOffer) return true;
      if (p.originalPrice && p.originalPrice > p.price) return true;
      return false;
    });

    if (fallbackOffers.length > 0) {
      return fallbackOffers
        .slice(0, 4)
        .map((p) => ({ ...p, originalPrice: p.originalPrice ?? p.price }));
    }

    return products
      .filter((p) => p.active !== false)
      .slice(0, 4)
      .map((p) => ({ ...p, originalPrice: p.originalPrice ?? p.price }));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        homeConfig,
        setHomeConfig,
        updateProduct,
        createProduct,
        getDailyOffers,
        saveHomeConfig,
        loading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used within a ProductProvider");
  return context;
};
