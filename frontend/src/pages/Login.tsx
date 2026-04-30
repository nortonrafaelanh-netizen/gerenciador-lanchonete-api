import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../app/context/AuthContext";
import { Lock, User, ShieldCheck, Eye, EyeOff, Zap } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate(email === "admin@tenacious.com" ? "/admin" : "/");
    } else {
      setError("Email ou senha incorretos.");
    }
  };

  const fillCredentials = (type: "admin" | "customer") => {
    if (type === "admin") {
      setEmail("admin@tenacious.com");
      setPassword("123");
    } else {
      setEmail("cliente@teste.com");
      setPassword("123");
    }
  };

  const handleQuickTest = async () => {
    setLoading(true);
    const success = await login("admin@tenacious.com", "123");
    setLoading(false);
    if (success) navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-orange-50 rounded-2xl text-orange-600 mb-4">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase italic">
            Tenacious Burgers
          </h2>
          <p className="text-gray-500 font-bold text-sm">
            Sistema de Gerenciamento
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
              placeholder="••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2 uppercase italic tracking-tighter disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Credenciais de Teste */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-center text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">
            Credenciais de Teste
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Franqueado */}
            <button
              onClick={() => fillCredentials("admin")}
              className="flex flex-col p-4 bg-orange-50 border-2 border-orange-100 hover:border-orange-400 rounded-2xl transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={18} className="text-orange-600" />
                <span className="text-xs font-black uppercase text-orange-700">
                  Franqueado
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase w-10">
                    Login
                  </span>
                  <code className="text-[10px] bg-white border border-orange-200 px-1.5 py-0.5 rounded-lg text-orange-800 font-bold truncate">
                    admin@tenacious.com
                  </code>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase w-10">
                    Senha
                  </span>
                  <code className="text-[10px] bg-white border border-orange-200 px-1.5 py-0.5 rounded-lg text-orange-800 font-bold">
                    123
                  </code>
                </div>
              </div>
              <p className="text-[9px] text-orange-400 font-bold mt-2 group-hover:text-orange-600 transition-colors">
                Clique para preencher →
              </p>
            </button>

            {/* Cliente */}
            <button
              onClick={() => fillCredentials("customer")}
              className="flex flex-col p-4 bg-blue-50 border-2 border-blue-100 hover:border-blue-400 rounded-2xl transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-3">
                <User size={18} className="text-blue-600" />
                <span className="text-xs font-black uppercase text-blue-700">
                  Cliente
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase w-10">
                    Login
                  </span>
                  <code className="text-[10px] bg-white border border-blue-200 px-1.5 py-0.5 rounded-lg text-blue-800 font-bold truncate">
                    cliente@teste.com
                  </code>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase w-10">
                    Senha
                  </span>
                  <code className="text-[10px] bg-white border border-blue-200 px-1.5 py-0.5 rounded-lg text-blue-800 font-bold">
                    123
                  </code>
                </div>
              </div>
              <p className="text-[9px] text-blue-400 font-bold mt-2 group-hover:text-blue-600 transition-colors">
                Clique para preencher →
              </p>
            </button>
          </div>

          {/* Botão acesso rápido */}
          <button
            onClick={handleQuickTest}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-950 py-3.5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60"
          >
            <Zap size={18} className="fill-yellow-900" />
            Acesso Rápido — Franqueado
          </button>
        </div>
      </div>
    </div>
  );
}
