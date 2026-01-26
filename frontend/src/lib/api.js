import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
  getMe: () => apiClient.get("/auth/me"),
  updatePassword: (data) => apiClient.put("/auth/password", data),
};

// News API
export const newsAPI = {
  getNews: (params) => apiClient.get("/news", { params }),
  searchNews: (query, params) =>
    apiClient.get("/news/search", { params: { q: query, ...params } }),
  getByCategory: (category, params) =>
    apiClient.get(`/news/categories/${category}`, { params }),
  getSummary: (data) => apiClient.post("/news/summary", data),
};

// User API
export const userAPI = {
  getFavorites: () => apiClient.get("/user/favorites"),
  addFavorite: (data) => apiClient.post("/user/favorites", data),
  removeFavorite: (articleId) =>
    apiClient.delete(`/user/favorites/${articleId}`),
  updatePreferences: (data) => apiClient.put("/user/preferences", data),
  getProfile: () => apiClient.get("/user/profile"),
  updateProfile: (data) => apiClient.put("/user/profile", data),
};

export default apiClient;
