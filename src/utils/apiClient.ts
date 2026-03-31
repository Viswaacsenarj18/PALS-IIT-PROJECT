/* ============================================================
   API CLIENT - PRODUCTION READY (FINAL)
   Fixes:
   - Correct FormData handling (Cloudinary upload fix)
   - Safe auth handling
   - Clean error handling
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

  // ✅ Detect FormData (VERY IMPORTANT)
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {};

  // 🔐 Attach token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // ✅ Only set JSON header if NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // ✅ Merge headers safely
  if (options.headers) {
    const callerHeaders = options.headers as Record<string, string>;

    Object.entries(callerHeaders).forEach(([key, value]) => {
      // ❌ Prevent breaking FormData
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
    console.log("📦 Is FormData:", isFormData);

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

    // 🔐 Handle Unauthorized (NO auto logout)
    if (response.status === 401) {
      console.warn(`⚠️ 401 for ${endpoint}:`, data?.message);

      return {
        success: false,
        message: data?.message || "Unauthorized",
      };
    }

    // ❌ Other errors
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