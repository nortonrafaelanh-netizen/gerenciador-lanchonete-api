import api from "./api";

const orderService = {
  async create(data) {
    try {
      const response = await api.post("/pedidos", data);
      return response.data?.data;
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw error;
    }
  },

  async getMyOrders() {
    try {
      const response = await api.get("/meus-pedidos");
      return response.data?.data || [];
    } catch (error) {
      console.error("Erro ao listar meus pedidos:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data?.data;
    } catch (error) {
      console.error("Erro ao obter pedido:", error);
      return null;
    }
  },

  async updateStatus(id, status) {
    try {
      const response = await api.put(`/pedidos/${id}`, { status });
      return response.data?.data;
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      throw error;
    }
  },

  async byFranchise(franchiseId) {
    try {
      const response = await api.get(`/franquias/${franchiseId}/pedidos`);
      return response.data?.data || [];
    } catch (error) {
      console.error("Erro ao listar pedidos da franquia:", error);
      return [];
    }
  },
};

export default orderService;
