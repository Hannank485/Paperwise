import api from "./client";

const sessionApi = {
  async getSessions() {
    const result = await api.get("/sessions/");
    const data = await result.data;
    return data;
  },
  async deleteSession(id: number) {
    await api.post(`/sessions/${id}/delete`);
  },

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("pdf", file);
    const result = await api.post("/documents/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = await result.data;
    return data;
  },

  async getSingleSession(id: number) {
    const result = await api.get(`/sessions/${id}`);
    const data = await result.data;
    return data;
  },
  async sendQuestion(id: number, question: string) {
    const result = await api.post(`/sessions/${id}/message`, {
      question: question,
    });
    const data = await result.data;
    return data;
  },
};

export default sessionApi;
