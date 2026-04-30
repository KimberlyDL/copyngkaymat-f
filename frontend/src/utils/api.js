// src/utils/api.js
import axios from "axios";
import { useToast } from "@/utils/useToast";

// ====== Config ======
const API_ORIGIN = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:3000";
const TOKEN_KEY = "jwt";
const REFRESH_TOKEN_KEY = "refresh_token";

// ====== Axios base instance ======
const api = axios.create({
    baseURL: API_ORIGIN,
    withCredentials: true, // MANDATORY: Allows browser to send/receive HttpOnly cookies
    timeout: 20000,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json",
    },
});

// ====== Access Token Helpers (LocalStorage is okay for short-lived tokens) ======
export function getAuthToken() {
    try {
        return localStorage.getItem(TOKEN_KEY) || null;
    } catch { return null; }
}

export function setAuthToken(token) {
    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch { }
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearAuthToken() {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch { }
    delete api.defaults.headers.common.Authorization;
}

export function getRefreshToken() {
    try {
        return sessionStorage.getItem(REFRESH_TOKEN_KEY) || null;
    } catch { return null; }
}

export function setRefreshToken(token) {
    try {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch { }
}

export function clearRefreshToken() {
    try {
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch { }
}

// Re-init access token on boot
const bootToken = getAuthToken();
if (bootToken) setAuthToken(bootToken);

// ====== Interceptors ======
const RETRY_FLAG = "_retry";
let isRefreshing = false;
let refreshSubscribers = [];

const REFRESH_TIMEOUT_MS = 10_000;

function onTokenRefreshed(newToken) {
    refreshSubscribers.forEach(({ resolve }) => resolve(newToken));
    refreshSubscribers = [];
}

function rejectAllSubscribers(err) {
    refreshSubscribers.forEach(({ reject }) => reject(err));
    refreshSubscribers = [];
}

// Request Interceptor: Attach Access Token to every request
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle 401s via Silent Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;
        if (!response) return Promise.reject(error);

        // If the error comes from a public endpoint, reject immediately
        // so the caller (e.g. Login.vue) can handle it without a redirect loop
        const publicPaths = ['/login', '/google/redirect', '/google/exchange'];
        if (config.url && publicPaths.some(path => config.url.includes(path))) {
            return Promise.reject(error);
        }

        // If 401 and we haven't tried to refresh yet
        if (response.status === 401 && !config[RETRY_FLAG]) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    const timer = setTimeout(() => {
                        reject(new Error('Token refresh timed out'));
                    }, REFRESH_TIMEOUT_MS);

                    refreshSubscribers.push({
                        resolve: (newToken) => {
                            clearTimeout(timer);
                            config.headers.Authorization = `Bearer ${newToken}`;
                            config[RETRY_FLAG] = true;
                            resolve(api(config));
                        },
                        reject: (err) => {
                            clearTimeout(timer);
                            reject(err);
                        }
                    });
                });
            }

            config[RETRY_FLAG] = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(`${API_ORIGIN}/api/v1/auth/refresh`, {}, { withCredentials: true });

                const newAccessToken = data?.token;
                setAuthToken(newAccessToken);
                onTokenRefreshed(newAccessToken);
                isRefreshing = false;

                config.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(config);
            } catch (refreshError) {
                isRefreshing = false;
                rejectAllSubscribers(refreshError);
                clearAuthToken();

                // useToast() called here (not at module level) — Pinia is guaranteed active by now
                if (refreshError.response?.data?.code === 'TOKEN_REUSE_DETECTED') {
                    const toast = useToast();
                    toast.error('Security alert: Multiple login attempts detected. Please log in again.', 6000);
                }

                // Dynamic import avoids circular dep: api → router → auth → api
                const { default: router } = await import('@/router');
                if (router.currentRoute.value.name !== 'login') {
                    router.push({ name: 'login' });
                }

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export async function logoutEverywhere() {
    try { await api.post("/api/v1/auth/logout-all"); } catch { }
    clearAuthToken();
}

export async function logout() {
    try { await api.post("/api/v1/auth/logout"); } catch { }
    clearAuthToken();
}

export default api;
