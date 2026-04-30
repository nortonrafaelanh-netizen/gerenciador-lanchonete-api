import api from "./api";
import {
  Franchise,
  CreateFranchiseRequest,
  UpdateFranchiseRequest,
  FranchiseResponse,
} from "../types/api";

const franchiseService = {
  async list(): Promise<Franchise[]> {
    const response = await api.get<Franchise[]>("/franquias");
    return response.data;
  },

  async get(id: number): Promise<Franchise> {
    const response = await api.get<Franchise>(`/franquias/${id}`);
    return response.data;
  },

  async create(data: CreateFranchiseRequest): Promise<Franchise> {
    const response = await api.post<Franchise>("/franquias", data);
    return response.data;
  },

  async update(
    id: number,
    data: UpdateFranchiseRequest,
  ): Promise<FranchiseResponse> {
    const response = await api.put<FranchiseResponse>(`/franquias/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<FranchiseResponse> {
    const response = await api.delete<FranchiseResponse>(`/franquias/${id}`);
    return response.data;
  },
};

export default franchiseService;
