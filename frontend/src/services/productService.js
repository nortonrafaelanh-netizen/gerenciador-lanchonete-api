import api from "./api";

const productService = {
  async listByFranchise(franchiseId) {
    try {
      const response = await api.get(`/franquias/${franchiseId}/produtos`);
      return response.data?.data || [];
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      return [];
    }
  },

  async getAll() {
    try {
      const response = await api.get("/produtos");
      return response.data?.data || [];
    } catch (error) {
      console.error("Erro ao listar todos os produtos:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/produtos/${id}`);
      return response.data?.data;
    } catch (error) {
      console.error("Erro ao obter produto:", error);
      return null;
    }
  },

  async create(data) {
    try {
      const response = await api.post("/produtos", data);
      return response.data?.data;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/produtos/${id}`, data);
      return response.data?.data;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/produtos/${id}`);
      return true;
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  },
};

export default productService;
