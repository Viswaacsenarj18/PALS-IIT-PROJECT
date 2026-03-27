/* ============================================================
   CENTRALIZED API CONFIGURATION
   Production-ready (Vercel + Render)
============================================================ */

/**
 * Debug helper (safe logs)
 */
const debugEnv = () => {
  if (typeof window !== "undefined") {
    console.log("🔍 [API CONFIG DEBUG]");
    console.log("DEV Mode:", import.meta.env.DEV);
    console.log("MODE:", import.meta.env.MODE);
    console.log("Hostname:", window.location.hostname);
    console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  }
};

/**
 * Get API base URL
 */
const getApiBaseUrl = (): string => {
  try {
    // ✅ 1. Use ENV variable (highest priority)
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
      console.log("✅ Using ENV API URL:", envUrl);
      return envUrl;
    }

    // ✅ 2. Development (localhost)
    if (import.meta.env.DEV) {
      console.log("✅ Using localhost (DEV)");
      return "http://localhost:5000";
    }

    // ✅ 3. Production fallback (Render)
    console.log("✅ Using Render fallback");
    return "https://pals-iit-project.onrender.com";

  } catch (error) {
    console.error("❌ API config error:", error);
    return "https://pals-iit-project.onrender.com";
  }
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Build full API URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export { debugEnv };

/**
 * Common endpoints (optional helper)
 */
export default {
  API_BASE_URL,
  getApiUrl,
  debugEnv,
  endpoints: {
    tractors: "/api/tractors",
    registerTractor: "/api/tractors/register",
    getTractor: (id: string) => `/api/tractors/${id}`,
    confirmRental: "/api/tractors/confirm-rental",
    login: "/api/auth/login",
    signup: "/api/auth/register",
    products: "/api/products",
  },
};