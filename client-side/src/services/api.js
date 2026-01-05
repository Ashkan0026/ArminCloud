// src/services/api.js
import axios from "axios";

/**
 * Central Axios instance
 * - Base URL from Vite env: VITE_API_BASE_URL (recommended)
 * - Falls back to Vite proxy mode ("/api") if env not set
 * - Attaches Bearer token from localStorage on every request
 * - Normalizes errors into a predictable shape
 *
 * Setup options:
 * 1) Recommended (no proxy):
 *    - Create .env in frontend root:
 *        VITE_API_BASE_URL=http://localhost:3000
 *    - And call endpoints like api.get("/machines/get")
 *
 * 2) Proxy mode (recommended for local dev to avoid CORS):
 *    - In vite.config.js, proxy "/api" -> "http://localhost:3000"
 *    - Leave VITE_API_BASE_URL empty
 *    - Call endpoints like api.get("/api/machines/get")
 *
 * Choose ONE consistent style across your services.
 */

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  ""; // empty means "same origin" => proxy mode if you use "/api/..."

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const normalized = normalizeAxiosError(error);

    // Optional: auto-logout on 401
    if (normalized.status === 401) {
      // if your backend returns 401 for expired/invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("auth_mode");
      // Don't navigate here (services layer shouldn't depend on router).
      // UI can redirect based on missing token.
    }

    return Promise.reject(normalized);
  }
);

/**
 * Helpers
 */

export function normalizeAxiosError(error) {
  // Axios error formats:
  // - error.response (server responded with non-2xx)
  // - error.request (no response)
  // - error.message (setup issue)
  const status = error?.response?.status ?? 0;

  // Many backends send errors like:
  // { message: "..." } OR { error: "..." } OR { errors: [...] }
  const data = error?.response?.data;
  const serverMessage =
    (data && (data.message || data.error)) ||
    (Array.isArray(data?.errors) && data.errors[0]?.message) ||
    null;

  const message =
    serverMessage ||
    (status ? `Request failed with status ${status}` : "Network error. Please check your connection.");

  return {
    name: "ApiError",
    message,
    status,
    data,
    original: error,
  };
}

/**
 * Small convenience wrappers (optional)
 * Use these if you want consistent `.data` return.
 */
export async function get(url, config) {
  const res = await api.get(url, config);
  return res.data;
}

export async function post(url, body, config) {
  const res = await api.post(url, body, config);
  return res.data;
}

export async function patch(url, body, config) {
  const res = await api.patch(url, body, config);
  return res.data;
}

export async function del(url, config) {
  const res = await api.delete(url, config);
  return res.data;
}
