import axios from "axios";

// Criar instância do axios com configuração padrão
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token aos requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@Tenacious:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se for erro 401, limpar token (sessão expirada)
    if (error.response?.status === 401) {
      localStorage.removeItem("@Tenacious:token");
      localStorage.removeItem("@Tenacious:user");
      window.dispatchEvent(new Event("auth:logout"));
    }

    // Estruturar erro de forma consistente
    const apiError = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      errors: error.response?.data?.errors || {},
    };

    return Promise.reject(apiError);
  },
);

export default api;
