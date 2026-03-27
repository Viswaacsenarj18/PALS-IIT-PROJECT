/* ============================================================
   API CLIENT - FINAL FIXED VERSION
   Fixes:
   - Prevent logout on delete API
   - Safe FormData handling
   - Clean auth handling
============================================================ */

import { getApiUrl } from "@/config/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {};

  // ✅ Attach token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // ✅ Content-Type only for JSON
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // ✅ Merge headers safely
  if (options.headers) {
    const callerHeaders = options.headers as Record<string, string>;
    Object.entries(callerHeaders).forEach(([key, value]) => {
      if (isFormData && key.toLowerCase() === "content-type") return;
      headers[key] = value;
    });
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    console.log(`📡 API ${config.method || "GET"} → ${endpoint}`);

    const response = await fetch(getApiUrl(endpoint), config);

    const contentType = response.headers.get("content-type");
    let data: any;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: false, message: text || "Unknown error" };
    }

    console.log(`📡 API Response [${response.status}]:`, data);

    /* 🔐 FIXED AUTH HANDLING */
    if (response.status === 401) {
      const msg = data?.message?.toLowerCase() || "";

      const shouldLogout =
        msg.includes("token") ||
        msg.includes("expired") ||
        msg.includes("invalid signature") ||
        msg.includes("jwt");

      if (shouldLogout) {
        console.warn("🔐 Token invalid — logging out");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        window.location.href = "/login";

        return {
          success: false,
          message: "Session expired. Please login again.",
        };
      }

      // ❗ DO NOT LOGOUT for other 401 errors (like delete)
      return {
        success: false,
        message: data?.message || "Unauthorized request",
      };
    }

    /* ❌ Other errors */
    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Request failed",
      };
    }

    return data;

  } catch (error: any) {
    console.error("❌ API Fetch Error:", error);

    return {
      success: false,
      message: error?.message || "Network error. Please check connection.",
    };
  }
};

export const useApiClient = () => ({ apiFetch });

export default apiFetch;