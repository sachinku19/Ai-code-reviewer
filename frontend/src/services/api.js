import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 120000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("acr_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("acr_token");
      localStorage.removeItem("acr_user");
      if (!window.location.pathname.includes("login")) window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me")
};

export const aiApi = {
  review: (payload) => api.post("/ai/review", payload),
  optimize: (payload) => api.post("/ai/optimize", payload),
  explain: (payload) => api.post("/ai/explain", payload)
};

export const historyApi = {
  list: () => api.get("/history"),
  get: (id) => api.get(`/history/${id}`),
  delete: (id) => api.delete(`/history/${id}`),
  clear: () => api.delete("/history")
};

export const userApi = {
  profile: () => api.get("/user/profile"),
  updateProfile: (payload) => api.put("/user/profile", payload),
  settings: () => api.get("/user/settings"),
  updateSettings: (payload) => api.put("/user/settings", payload)
};

export default api;
