// Tipos de usuário
export type UserRole = "FRANQUEADO" | "CLIENTE" | "ADMIN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

// Tipos de resposta de autenticação
export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthRegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: UserRole;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface AuthMeResponse {
  user: User;
}

export interface LogoutResponse {
  message: string;
}

// Tipos de Franquia
export interface Franchise {
  id: number;
  nome: string;
  endereco: string;
  cnpj: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateFranchiseRequest {
  nome: string;
  endereco: string;
  cnpj: string;
}

export interface UpdateFranchiseRequest {
  nome?: string;
  endereco?: string;
  cnpj?: string;
  ativo?: boolean;
}

export interface FranchiseResponse {
  message?: string;
  data?: Franchise;
}

export interface FranchisesListResponse {
  message?: string;
  data?: Franchise[];
}

// Tipo de erro estruturado
export interface ApiError {
  status?: number;
  message: string;
  errors?: Record<string, string[]>;
}

// Resposta genérica de sucesso
export interface ApiResponse<T> {
  message?: string;
  data?: T;
}

// Resposta paginada (para futuros usos)
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}
