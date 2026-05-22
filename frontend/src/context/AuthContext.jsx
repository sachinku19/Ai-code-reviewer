import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("acr_user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("acr_token"));
  const [booting, setBooting] = useState(Boolean(localStorage.getItem("acr_token")));

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      if (!token) {
        setBooting(false);
        return;
      }
      try {
        const { data } = await authApi.me();
        if (mounted) {
          setUser(data.user);
          localStorage.setItem("acr_user", JSON.stringify(data.user));
        }
      } catch {
        if (mounted) logout();
      } finally {
        if (mounted) setBooting(false);
      }
    };
    hydrate();
    return () => {
      mounted = false;
    };
  }, [token]);

  const persist = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem("acr_user", JSON.stringify(payload.user));
    localStorage.setItem("acr_token", payload.token);
  };

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    persist(data);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    persist(data);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("acr_user");
    localStorage.removeItem("acr_token");
  };

  const value = useMemo(() => ({ user, setUser, token, login, register, logout, booting }), [user, token, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
