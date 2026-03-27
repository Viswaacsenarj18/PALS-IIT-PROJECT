export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return !!(token && role); // ✅ Both token AND role must exist
};

export const getStoredRole = () => {
  return localStorage.getItem("role") || "";
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
};
