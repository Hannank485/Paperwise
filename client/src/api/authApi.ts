import api from "./client";

const authApi = {
  async checkAuth() {
    await api.post("auth/me");
  },
  async regsiter(username: string, password: string) {
    await api.post("auth/register", { username, password });
  },
  async login(username: string, password: string) {
    const accessToken = await api.post("auth/login", { username, password });
    return accessToken;
  },
  async logout() {
    await api.post("auth/logout");
  },
};

export default authApi;
