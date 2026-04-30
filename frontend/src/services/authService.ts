import api from "./api";
import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthResponse,
  AuthMeResponse,
  LogoutResponse,
} from "../types/api";

const authService = {
  async login(credentials: AuthLoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(data: AuthRegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async logout(): Promise<LogoutResponse> {
    const response = await api.post<LogoutResponse>("/auth/logout");
    return response.data;
  },

  async getMe(): Promise<AuthMeResponse> {
    const response = await api.get<AuthMeResponse>("/auth/me");
    return response.data;
  },
};

export default authService;
