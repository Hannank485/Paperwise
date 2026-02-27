import api from "./client";

const sessionApi = {
  async getSessions() {
    const result = await api.get("/session/getAll");
    const data = await result.data;
    return data;
  },
  async deleteSession(id: number) {
    await api.post(`/session/${id}/delete`);
  },

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("pdf", file);
    const result = await api.post("/file/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = await result.data;
    return data;
  },

  async getSingleSession(id: number) {
    const result = await api.get(`/session/get/${id}`);
    const data = await result.data;
    return data;
  },
  async sendQuestion(id: number) {
    const result = await api.post(`/session/${id}/message`);
    const data = await result.data;
    return data;
  },
};

export default sessionApi;
