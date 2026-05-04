// @ts-nocheck
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "../../services/api";

interface User {
  id: number;
  email: string;
  role: "FRANQUEADO" | "CLIENTE" | "ADMIN";
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsTestFranchisee: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    role?: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Credenciais de teste (funcionam sem backend) ─────────────────
const TEST_USERS: Record<
  string,
  { password: string; user: User; token: string }
> = {
  "admin@tenacious.com": {
    password: "123456",
    token: "fake-jwt-franqueado",
    user: {
      id: 1,
      email: "admin@tenacious.com",
      name: "Nórton Leonardo",
      role: "FRANQUEADO",
    },
  },
  "cliente@tenacious.com": {
    password: "123456",
    token: "fake-jwt-cliente",
    user: {
      id: 2,
      email: "cliente@tenacious.com",
      name: "Cliente de Teste",
      role: "CLIENTE",
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("@Tenacious:user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("@Tenacious:token"),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) localStorage.setItem("@Tenacious:token", token);
    else localStorage.removeItem("@Tenacious:token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("@Tenacious:user", JSON.stringify(user));
    else localStorage.removeItem("@Tenacious:user");
  }, [user]);

  const loginAsTestFranchisee = async () => {
    await login("admin@tenacious.com", "123456");
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Email ou senha incorretos.";
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    role: string = "CLIENTE",
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao registrar");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Só chama API se o token não for de teste
      if (token && !token.startsWith("fake-")) {
        await api.post("/auth/logout").catch(() => {});
      }
    } finally {
      setToken(null);
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        isAuthenticated: !!user && !!token,
        login,
        loginAsTestFranchisee,
        logout,
        register,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}
