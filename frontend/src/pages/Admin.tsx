// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useAuth } from "../app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../app/context/ProductContext";
import { ProductModal } from "../app/components/ProductModal";
import { HomeManager } from "../app/components/HomeManager";
import {
  Edit3,
  Trash2,
  Plus,
  LogOut,
  Tag,
  MapPin,
  PackagePlus,
  LayoutDashboard,
  Zap,
  UtensilsCrossed,
} from "lucide-react";

const CITIES = [
  "Rio do Sul",
  "Atalanta",
  "Ituporanga",
  "Agrolândia",
  "Laurentino",
  "Trombudo Central",
];

const CATEGORY_LABEL = {
  burger: "Burger",
  dog: "Hot Dog",
  side: "Acompanhamento",
  combo: "Combo",
};

const CATEGORY_COLOR = {
  burger: "bg-orange-100 text-orange-700",
  dog: "bg-yellow-100 text-yellow-700",
  side: "bg-green-100 text-green-700",
  combo: "bg-purple-100 text-purple-700",
};

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { products, setProducts, createProduct, updateProduct } = useProducts();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCity, setFilterCity] = useState("all");

  useEffect(() => {
    if (!user || user.role !== "FRANQUEADO") {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente excluir este item do cardápio?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSave = async (product) => {
    if (editingProduct) {
      await updateProduct(product);
    } else {
      await createProduct(product);
    }
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    const matchCity = filterCity === "all" || !p.city || p.city === filterCity;
    return matchCat && matchCity;
  });

  if (!user || user.role !== "FRANQUEADO") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-red-500 mb-2">
            Acesso Restrito
          </h1>
          <p className="text-gray-600 mb-4">
            Apenas franqueados podem acessar esta área
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={17} />,
    },
    { id: "cardapio", label: "Cardápio", icon: <UtensilsCrossed size={17} /> },
    { id: "home", label: "Home", icon: <Zap size={17} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Painel do Franqueado
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Olá, {user.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 flex border-t border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">
                  Total de Produtos
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {products.length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">
                  Burgers
                </p>
                <p className="text-3xl font-bold text-orange-500">
                  {products.filter((p) => p.category === "burger").length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">
                  Combos
                </p>
                <p className="text-3xl font-bold text-purple-500">
                  {products.filter((p) => p.category === "combo").length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">
                  Franqueado
                </p>
                <p className="text-lg font-bold text-orange-600 truncate">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab("cardapio")}
                className="bg-white border border-gray-100 rounded-xl p-6 text-left hover:border-orange-300 hover:shadow-md transition-all group"
              >
                <UtensilsCrossed
                  size={28}
                  className="text-orange-500 mb-3 group-hover:scale-110 transition-transform"
                />
                <h3 className="font-bold text-gray-800 mb-1">
                  Gerenciar Cardápio
                </h3>
                <p className="text-sm text-gray-500">
                  Adicione, edite ou remova produtos e combos
                </p>
              </button>
              <button
                onClick={() => setActiveTab("home")}
                className="bg-white border border-gray-100 rounded-xl p-6 text-left hover:border-yellow-300 hover:shadow-md transition-all group"
              >
                <Zap
                  size={28}
                  className="text-yellow-500 fill-yellow-400 mb-3 group-hover:scale-110 transition-transform"
                />
                <h3 className="font-bold text-gray-800 mb-1">Controlar Home</h3>
                <p className="text-sm text-gray-500">
                  Defina as ofertas do dia e promoções em destaque
                </p>
              </button>
            </div>
          </div>
        )}

        {/* CARDÁPIO */}
        {activeTab === "cardapio" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Gerenciar Cardápio
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                <Plus size={16} /> Novo Produto / Combo
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="all">Todas categorias</option>
                  <option value="burger">Burger</option>
                  <option value="dog">Hot Dog</option>
                  <option value="side">Acompanhamento</option>
                  <option value="combo">Combo</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="all">Todas franquias</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800";
                      }}
                    />
                    {/* ✅ Corrigido: !! garante booleano, evita renderizar "0" */}
                    {!!product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100,
                          )}
                          %
                        </span>
                      )}

                    {product.category === "combo" && (
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <PackagePlus size={11} /> Combo
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base mb-1 text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    {product.city && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                        <MapPin size={11} />
                        <span>{product.city}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {/* ✅ Corrigido: !! evita renderizar "0" */}
                        {!!product.originalPrice &&
                          product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through block">
                              R$ {product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        <span className="text-lg font-bold text-orange-600">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${CATEGORY_COLOR[product.category] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {CATEGORY_LABEL[product.category] ?? "Produto"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                      >
                        <Edit3 size={14} /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                      >
                        <Trash2 size={14} /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  Nenhum produto encontrado com esses filtros
                </p>
                <button
                  onClick={() => {
                    setFilterCategory("all");
                    setFilterCity("all");
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* HOME MANAGER */}
        {activeTab === "home" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <HomeManager />
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
}
