import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/";
    }
    error.userMessage = error.response?.data?.message || "Something went wrong";
    return Promise.reject(error);
  },
);
export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || "Something went wrong";
  }
  return "Something went wrong";
};
export default api;
