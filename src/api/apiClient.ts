import axios from "axios";

const TOKEN_KEY = "xuma_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// La sesión de React registra aquí qué hacer cuando el token deja de ser válido (401).
let onUnauthorized: (() => void) | null = null;
export const setOnUnauthorized = (cb: () => void) => {
  onUnauthorized = cb;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error?.config?.url ?? "";
    // En 401 cerramos sesión, salvo en el propio login (ahí el 401 = credenciales malas).
    if (error?.response?.status === 401 && !url.includes("/auth/login")) {
      clearToken();
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
