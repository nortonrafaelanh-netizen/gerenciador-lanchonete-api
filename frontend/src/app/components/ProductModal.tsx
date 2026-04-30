import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { X, Upload, Plus, Trash2, PackagePlus } from "lucide-react";

interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
  category?: string;
  city?: string;
  comboItems?: string[];
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null;
}

const CITIES = [
  "Rio do Sul",
  "Atalanta",
  "Ituporanga",
  "Agrolândia",
  "Laurentino",
  "Trombudo Central",
];

const TABS = ["produto", "combo"] as const;
type Tab = (typeof TABS)[number];

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductModalProps) {
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState<Tab>("produto");

  const emptyProduct: Product = {
    id: Date.now(),
    name: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    image: "",
    description: "",
    category: "burger",
    city: "",
    comboItems: [],
  };

  const [formData, setFormData] = useState<Product>(emptyProduct);
  const [comboSearch, setComboSearch] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        ...emptyProduct,
        ...product,
        comboItems: product.comboItems ?? [],
      });
      setActiveTab(product.category === "combo" ? "combo" : "produto");
    } else {
      setFormData({ ...emptyProduct, id: Date.now() });
      setActiveTab("produto");
    }
    setComboSearch("");
  }, [product, isOpen]);

  // Auto-calculates discounted price
  useEffect(() => {
    if (formData.originalPrice && formData.discount) {
      const discounted = formData.originalPrice * (1 - formData.discount / 100);
      setFormData((prev) => ({
        ...prev,
        price: parseFloat(discounted.toFixed(2)),
      }));
    }
  }, [formData.originalPrice, formData.discount]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const numericFields = ["price", "originalPrice", "discount"];
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  // Combo helpers
  const filteredForCombo = products.filter(
    (p) =>
      p.category !== "combo" &&
      p.name.toLowerCase().includes(comboSearch.toLowerCase()) &&
      !formData.comboItems?.includes(String(p.id)),
  );

  const addToCombo = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      comboItems: [...(prev.comboItems ?? []), id],
    }));
  };

  const removeFromCombo = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      comboItems: (prev.comboItems ?? []).filter((i) => i !== id),
    }));
  };

  const comboProducts = products.filter((p) =>
    formData.comboItems?.includes(String(p.id)),
  );

  const comboPriceSum = comboProducts.reduce((acc, p) => acc + p.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "combo") {
      if (
        !formData.name ||
        !formData.price ||
        !formData.image ||
        !formData.description
      ) {
        alert("Preencha todos os campos do combo!");
        return;
      }
      if ((formData.comboItems ?? []).length < 2) {
        alert("Adicione pelo menos 2 produtos ao combo!");
        return;
      }
      onSave({ ...formData, category: "combo" });
    } else {
      if (
        !formData.name ||
        !formData.price ||
        !formData.image ||
        !formData.description
      ) {
        alert("Preencha todos os campos!");
        return;
      }
      onSave(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? "Editar" : "Novo"}{" "}
            {activeTab === "combo" ? "Combo" : "Produto"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("produto")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "produto"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Produto
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("combo")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === "combo"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <PackagePlus size={15} />
            Montar Combo
          </button>
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1 px-6 py-5 space-y-4"
        >
          {/* ── PRODUTO TAB ── */}
          {activeTab === "produto" && (
            <>
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Burger Premium"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Preço original + Desconto */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Original (R$)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice || ""}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount || ""}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Preço final calculado */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">
                  Preço Final
                </span>
                <span className="text-xl font-bold text-orange-600">
                  R$ {(formData.price || 0).toFixed(2)}
                </span>
              </div>

              {/* Categoria + Cidade */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="burger">Burger</option>
                    <option value="dog">Hot Dog</option>
                    <option value="side">Acompanhamento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Franquia (Cidade)
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Todas as franquias</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                    onError={() =>
                      setFormData((prev) => ({ ...prev, image: "" }))
                    }
                  />
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descrição do produto..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </>
          )}

          {/* ── COMBO TAB ── */}
          {activeTab === "combo" && (
            <>
              {/* Nome do combo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Combo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Combo Família"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Franquia (Cidade)
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Todas as franquias</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Busca de produtos para adicionar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adicionar Produtos ao Combo
                </label>
                <input
                  type="text"
                  value={comboSearch}
                  onChange={(e) => setComboSearch(e.target.value)}
                  placeholder="Buscar produto..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
                />
                <div className="border border-gray-200 rounded-lg max-h-36 overflow-y-auto divide-y divide-gray-100">
                  {filteredForCombo.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-3">
                      Nenhum produto encontrado
                    </p>
                  )}
                  {filteredForCombo.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-800">
                          {p.name}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          R$ {p.price.toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCombo(String(p.id))}
                        className="text-orange-500 hover:text-orange-700 transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Produtos selecionados no combo */}
              {comboProducts.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Itens do Combo ({comboProducts.length})
                  </label>
                  <div className="border border-orange-200 bg-orange-50 rounded-lg divide-y divide-orange-100">
                    {comboProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between px-3 py-2"
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-800">
                            {p.name}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            R$ {p.price.toFixed(2)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCombo(String(p.id))}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Soma dos itens: R$ {comboPriceSum.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Preço + Desconto do combo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Original (R$)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice || ""}
                    onChange={handleChange}
                    placeholder={comboPriceSum.toFixed(2)}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount || ""}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Preço final */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">
                  Preço Final do Combo
                </span>
                <span className="text-xl font-bold text-orange-600">
                  R$ {(formData.price || 0).toFixed(2)}
                </span>
              </div>

              {/* Imagem do combo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                    onError={() =>
                      setFormData((prev) => ({ ...prev, image: "" }))
                    }
                  />
                )}
              </div>

              {/* Descrição do combo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descrição do combo..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              {product ? "Atualizar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
