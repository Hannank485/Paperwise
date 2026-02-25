import api from "./client";

const sessionApi = {
  async getSessions() {
    const result = await api.get("/session/get");
    const data = result.data;
    return data;
  },
  async deleteSession(id: number) {
    await api.post(`/session/${id}/delete`);
  },
};

export default sessionApi;
