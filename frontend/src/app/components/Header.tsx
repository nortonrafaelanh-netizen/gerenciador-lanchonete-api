// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  MapPin,
  User,
  LogOut,
  LayoutDashboard,
  ImageOff,
  ChevronDown,
  Beef,
  Sandwich,
  UtensilsCrossed,
  Package,
  CupSoda,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { products } from "../data/products";

const franquias = [
  "Rio do Sul",
  "Atalanta",
  "Ituporanga",
  "Agrolândia",
  "Laurentino",
  "Trombudo Central",
];

const navLinks = [
  { to: "/burgers", label: "Burgers", icon: <Beef size={18} /> },
  { to: "/dogs", label: "Dogs", icon: <Sandwich size={18} /> },
  {
    to: "/sides",
    label: "Acompanhamentos",
    icon: <UtensilsCrossed size={18} />,
  },
  { to: "/combos", label: "Combos", icon: <Package size={18} /> },
  { to: "/drinks", label: "Bebidas", icon: <CupSoda size={18} /> },
];

export function Header() {
  const { cart, unidade, setUnidade, cartCount } = useCart();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUnidade, setShowUnidade] = useState(false);

  const isFranchisee = user?.role === "FRANQUEADO"; // ← única declaração

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const unidadeRef = useRef(null);

  const itemCount =
    typeof cartCount === "number"
      ? cartCount
      : cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const filtered = products
        .filter(
          (p) =>
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target))
        setShowSuggestions(false);
      if (unidadeRef.current && !unidadeRef.current.contains(event.target))
        setShowUnidade(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProduct = (productId) => {
    setSearchTerm("");
    setShowSuggestions(false);
    navigate(`/product/${productId}`);
  };

  return (
    <header className="bg-orange-600 text-white shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* LINHA SUPERIOR */}
        <div className="flex items-center justify-between h-20 gap-4">
          <Link
            to="/"
            className="text-2xl font-black hover:text-orange-100 transition-all flex-shrink-0 flex items-center gap-2"
          >
            <span className="text-3xl">🍔</span>
            <span className="hidden sm:block tracking-tighter uppercase italic">
              Tenacious Burgers
            </span>
          </Link>

          {/* Barra de Pesquisa */}
          <div className="flex-1 max-w-lg relative" ref={searchRef}>
            <div className="relative group">
              <input
                type="text"
                placeholder="O que vamos comer hoje?"
                className="w-full py-2.5 pl-11 pr-4 rounded-2xl bg-orange-700/50 border border-orange-500/30 text-white placeholder-orange-200/60 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-200 group-focus-within:text-orange-600"
                size={20}
              />
            </div>

            {/* Dropdown Busca */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 text-gray-900 z-50">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-none"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff size={16} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-sm leading-tight">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-orange-600 font-bold uppercase">
                        {product.category}
                      </p>
                    </div>
                    <p className="font-black text-sm text-gray-700">
                      R$ {product.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ações direita */}
          <div className="flex items-center gap-3">
            {/* Seletor de Unidade */}
            <div className="relative hidden lg:block" ref={unidadeRef}>
              <button
                onClick={() => setShowUnidade(!showUnidade)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/10 transition-all font-bold text-sm"
              >
                <MapPin size={18} className="text-yellow-400" />
                {unidade}
                <ChevronDown
                  size={16}
                  className={showUnidade ? "rotate-180" : ""}
                />
              </button>

              {showUnidade && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 text-gray-800 min-w-[200px] py-2 z-50">
                  {franquias.map((cidade) => (
                    <button
                      key={cidade}
                      onClick={() => {
                        setUnidade(cidade);
                        setShowUnidade(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-orange-50 transition-colors ${
                        unidade === cidade
                          ? "text-orange-600 font-bold bg-orange-50"
                          : ""
                      }`}
                    >
                      {cidade}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Carrinho */}
            <Link
              to="/cart"
              className="relative p-2.5 bg-yellow-400 text-orange-900 rounded-xl hover:bg-yellow-300 transition-all shadow-md active:scale-95"
            >
              <ShoppingCart size={22} strokeWidth={2.5} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-red-600 text-[11px] font-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-red-600">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Usuário */}
            {user ? (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/20">
                <Link
                  to={isFranchisee ? "/admin" : "/perfil"}
                  className="flex items-center gap-2 hover:text-orange-200 transition-colors"
                >
                  {isFranchisee ? (
                    <LayoutDashboard size={17} />
                  ) : (
                    <User size={17} />
                  )}
                  <span className="text-xs font-black uppercase tracking-wider hidden md:inline">
                    {user.name?.split(" ")[0]}
                  </span>
                </Link>
                <div className="w-px h-4 bg-white/30" />
                <button
                  onClick={logout}
                  title="Sair"
                  className="hover:text-red-300 transition-colors"
                >
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-orange-600 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-50 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* NAVEGAÇÃO DE CATEGORIAS */}
        <div className="border-t border-orange-400/30 flex items-center">
          <nav className="flex overflow-x-auto py-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-6 py-4 font-black text-[11px] uppercase tracking-[0.15em] transition-all relative group whitespace-nowrap ${
                  location.pathname === link.to
                    ? "text-yellow-300"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.icon}
                {link.label}
                <span
                  className={`absolute bottom-0 left-6 right-6 h-1 bg-yellow-400 transition-transform origin-left ${
                    location.pathname === link.to
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}

            {/* Link painel — dentro do return ✓ */}
            {isFranchisee && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-6 py-4 font-black text-[11px] uppercase tracking-[0.15em] text-yellow-300 hover:text-white transition-colors bg-white/10 border-l border-orange-500/50 whitespace-nowrap"
              >
                <LayoutDashboard size={18} />
                Painel de Edição
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
