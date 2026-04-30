// @ts-nocheck
import { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import {
  Zap,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Tag,
  CalendarDays,
  LayoutDashboard,
  ShoppingBag,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

interface OfferItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
  originalPrice: number;
  activeFrom?: string;
  activeTo?: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  burger: "Burgers",
  dog: "Hot Dogs",
  side: "Acompanhamentos",
  drink: "Bebidas",
  combo: "Combos",
};

const CATEGORY_COLOR: Record<string, string> = {
  burger: "bg-orange-100 text-orange-700",
  dog: "bg-yellow-100 text-yellow-700",
  side: "bg-green-100 text-green-700",
  drink: "bg-blue-100 text-blue-700",
  combo: "bg-purple-100 text-purple-700",
};

export function HomeManager() {
  const { products, homeConfig, setHomeConfig, saveHomeConfig } = useProducts();
  const [activeTab, setActiveTab] = useState<"offers" | "combos" | "banners">(
    "offers",
  );

  const categoryOrder = ["burger", "dog", "side", "drink", "combo"];

  // --- LÓGICA DE OFERTAS (Mantida e melhorada) ---
  const buildOffers = (): OfferItem[] => {
    if (!homeConfig?.dailyOffersIds?.length) {
      return products
        .filter((p) => p.originalPrice && p.originalPrice > p.price)
        .slice(0, 3)
        .map((p) => ({ ...p, originalPrice: p.originalPrice! }));
    }
    return homeConfig.dailyOffersIds
      .map((id: string) => {
        const p = products.find((prod) => String(prod.id) === String(id));
        if (!p) return null;
        const saved = homeConfig.offersData?.[id] ?? {};
        return {
          ...p,
          price: saved.price ?? p.price,
          originalPrice: saved.originalPrice ?? p.originalPrice ?? p.price,
          activeFrom: saved.activeFrom,
          activeTo: saved.activeTo,
        };
      })
      .filter(Boolean) as OfferItem[];
  };

  const [offers, setOffers] = useState<OfferItem[]>(buildOffers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setOffers(buildOffers());
  }, [products, homeConfig]);

  const available = products.filter(
    (p) => !offers.find((o) => String(o.id) === String(p.id)),
  );

  const groupedProducts = categoryOrder
    .map((category) => ({
      category,
      products: available.filter(
        (product) => String(product.category).toLowerCase() === category,
      ),
    }))
    .filter((group) => group.products.length > 0);

  const addOffer = (product: any) => {
    if (offers.length >= 6) return alert("Máximo de 6 ofertas!");
    setOffers((prev) => [
      ...prev,
      { ...product, originalPrice: product.originalPrice ?? product.price },
    ]);
  };

  const removeOffer = (id: string | number) =>
    setOffers((prev) => prev.filter((o) => String(o.id) !== String(id)));

  const updateOffer = (id: string | number, changes: Partial<OfferItem>) =>
    setOffers((prev) =>
      prev.map((o) => (String(o.id) === String(id) ? { ...o, ...changes } : o)),
    );

  const moveOffer = (index: number, direction: "up" | "down") => {
    const next = [...offers];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    setOffers(next);
  };

  const discount = (offer: OfferItem) =>
    offer.originalPrice > offer.price
      ? Math.round(
          ((offer.originalPrice - offer.price) / offer.originalPrice) * 100,
        )
      : 0;

  const handlePublish = async () => {
    const offersData: Record<string, any> = {};
    offers.forEach((o) => {
      offersData[String(o.id)] = {
        originalPrice: o.originalPrice,
        price: o.price,
        activeFrom: o.activeFrom,
        activeTo: o.activeTo,
      };
    });

    const newConfig = {
      dailyOffersIds: offers.map((o) => String(o.id)),
      offersData,
    };

    try {
      // Atualiza o estado global
      setHomeConfig(newConfig);

      // Envia para o backend Laravel
      await saveHomeConfig(newConfig);

      alert("✅ Configurações publicadas no Banco de Dados!");
    } catch (error) {
      alert("❌ Erro ao salvar configurações.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. DASHBOARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Ofertas Ativas
            </p>
            <p className="text-2xl font-black text-gray-800">
              {offers.length} / 6
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Combos Destaque
            </p>
            <p className="text-2xl font-black text-gray-800">2 / 2</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
            <ImageIcon size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Banners Ativos
            </p>
            <p className="text-2xl font-black text-gray-800">1</p>
          </div>
        </div>
      </div>

      {/* 2. TABS NAVIGATION */}
      <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
        {[
          { id: "offers", label: "Ofertas do Dia", icon: Zap },
          { id: "combos", label: "Combos Legendários", icon: ShoppingBag },
          { id: "banners", label: "Banners Hero", icon: ImageIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        {/* Header da Seção */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black text-gray-900 uppercase italic">
              {activeTab === "offers" && "Gerenciar Ofertas"}
              {activeTab === "combos" && "Gerenciar Combos Legendários"}
              {activeTab === "banners" && "Configurar Banner Principal"}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Personalize a experiência visual da sua vitrine
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOffers([])}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-xs font-black uppercase tracking-widest"
            >
              <RotateCcw size={14} /> Limpar
            </button>
            <button
              onClick={() => setPreviewMode((v) => !v)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                previewMode
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
                  : "bg-white border-2 border-gray-100 text-gray-600 hover:border-orange-200"
              }`}
            >
              <Eye size={16} />{" "}
              {previewMode ? "Sair do Preview" : "Ver na Home"}
            </button>
          </div>
        </div>

        <div className="p-8">
          {activeTab === "offers" && (
            <>
              {previewMode ? (
                /* GRID DE PREVIEW (MANTIDO) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:scale-[1.02] transition-transform"
                    >
                      <div className="relative h-52 bg-gray-100">
                        <img
                          src={offer.image}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">
                            OFERTA!
                          </span>
                        </div>
                        {discount(offer) > 0 && (
                          <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-xl">
                            -{discount(offer)}%
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h4 className="font-black text-gray-900 text-xl uppercase italic tracking-tighter mb-2">
                          {offer.name}
                        </h4>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4 font-medium">
                          {offer.description}
                        </p>
                        <div className="flex items-end justify-between border-t border-gray-50 pt-4">
                          <div>
                            <span className="text-gray-300 line-through text-xs font-bold block mb-1">
                              R$ {offer.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-gray-900 font-black text-2xl italic tracking-tighter">
                              R$ {offer.price.toFixed(2)}
                            </span>
                          </div>
                          <button className="bg-orange-600 text-white p-3 rounded-2xl shadow-lg shadow-orange-100">
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* EDITOR DE OFERTAS (MANTIDO E POLIDO) */
                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <GripVertical size={14} /> Ordenação e Detalhes
                    </h4>
                    {offers.map((offer, index) => (
                      <div
                        key={offer.id}
                        className="bg-white border-2 border-gray-50 rounded-[2rem] p-4 hover:border-orange-100 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveOffer(index, "up")}
                              disabled={index === 0}
                              className="p-1 text-gray-300 hover:text-orange-500 disabled:opacity-0"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              onClick={() => moveOffer(index, "down")}
                              disabled={index === offers.length - 1}
                              className="p-1 text-gray-300 hover:text-orange-500 disabled:opacity-0"
                            >
                              <ChevronDown size={20} />
                            </button>
                          </div>
                          <img
                            src={offer.image}
                            className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                          />
                          <div className="flex-1">
                            <p className="font-black text-gray-800 uppercase italic text-sm">
                              {offer.name}
                            </p>
                            <span className="text-orange-600 font-bold text-sm">
                              R$ {offer.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setEditingId(
                                  editingId === String(offer.id)
                                    ? null
                                    : String(offer.id),
                                )
                              }
                              className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100"
                            >
                              <Tag size={18} />
                            </button>
                            <button
                              onClick={() => removeOffer(offer.id)}
                              className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        {editingId === String(offer.id) && (
                          <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="col-span-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">
                                Preço De (R$)
                              </label>
                              <input
                                type="number"
                                value={offer.originalPrice}
                                onChange={(e) =>
                                  updateOffer(offer.id, {
                                    originalPrice: parseFloat(e.target.value),
                                  })
                                }
                                className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div className="col-span-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">
                                Preço Por (R$)
                              </label>
                              <input
                                type="number"
                                value={offer.price}
                                onChange={(e) =>
                                  updateOffer(offer.id, {
                                    price: parseFloat(e.target.value),
                                  })
                                }
                                className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* BUSCA DE PRODUTOS */}
                  <div className="bg-gray-50 rounded-[2.5rem] p-8">
                    <div className="mb-6">
                      <p className="text-sm font-black uppercase tracking-[0.25em] text-gray-400">
                        Itens do cardápio disponíveis
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Selecione os itens abaixo para publicar como Ofertas do
                        Dia.
                      </p>
                    </div>
                    <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {groupedProducts.length > 0 ? (
                        groupedProducts.map((group) => (
                          <div key={group.category}>
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase ${
                                  CATEGORY_COLOR[group.category] ??
                                  "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {CATEGORY_LABEL[group.category] ??
                                  group.category}
                              </span>
                              <span className="text-xs text-gray-400">
                                {group.products.length} itens
                              </span>
                            </div>
                            <div className="grid gap-3">
                              {group.products.map((product) => (
                                <div
                                  key={product.id}
                                  className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm"
                                >
                                  <img
                                    src={product.image}
                                    className="w-14 h-14 rounded-2xl object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-800 text-sm truncate">
                                      {product.name}
                                    </p>
                                    <p className="text-gray-500 text-xs truncate">
                                      {product.description}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-orange-600 font-black text-sm">
                                      R$ {product.price.toFixed(2)}
                                    </p>
                                    <button
                                      onClick={() => addOffer(product)}
                                      className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.15em] hover:bg-orange-500 transition-all"
                                    >
                                      Adicionar
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 text-center text-gray-400">
                          Nenhum item disponível para adicionar. Verifique o
                          cardápio.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "combos" && (
            <div className="py-20 text-center">
              <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">
                Módulo de Seleção de Combos será habilitado automaticamente ao
                detectar categorias 'Combo'.
              </p>
            </div>
          )}

          {activeTab === "banners" && (
            <div className="py-20 text-center">
              <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">
                Upload de Banners promocionais (Recomendado: 1600x500px).
              </p>
            </div>
          )}
        </div>

        {/* Footer de Ação */}
        <div className="px-8 py-6 bg-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex -space-x-2">
              {offers.slice(0, 3).map((o) => (
                <img
                  key={o.id}
                  src={o.image}
                  className="w-8 h-8 rounded-full border-2 border-gray-900 object-cover"
                />
              ))}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">
              {offers.length} itens prontos para o ar
            </span>
          </div>
          <button
            onClick={handlePublish}
            className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-orange-900/20"
          >
            <Zap size={20} className="fill-white" />
            Publicar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
