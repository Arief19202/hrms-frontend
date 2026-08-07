import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const cleanBaseUrl = rawApiUrl.replace(/\/$/, "");

const api = axios.create({
  baseURL: cleanBaseUrl.endsWith("/api") ? cleanBaseUrl : `${cleanBaseUrl}/api`,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      config.headers["x-timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      // ignore
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;