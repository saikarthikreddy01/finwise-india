import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("finwise_user") || "null"); } catch { return null; }
  });

  function saveSession(data) {
    localStorage.setItem("finwise_access_token", data.accessToken);
    localStorage.setItem("finwise_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(name, email, password) {
    const { data } = await api.post("/auth/register", { name, email, password });
    saveSession(data);
  }

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data);
  }

  async function refreshUser() {
    const { data } = await api.get("/auth/me");
    localStorage.setItem("finwise_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function logout() {
    localStorage.removeItem("finwise_access_token");
    localStorage.removeItem("finwise_user");
    setUser(null);
  }

  const value = useMemo(() => ({
    user,
    login,
    register,
    refreshUser,
    logout
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
