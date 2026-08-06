import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { apiFetch } from "../lib/api";

interface User {
  id: string;
  fullName: string;
  email: string;
  photoUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Evita disparar /auth/refresh duas vezes em paralelo (ex: dupla invocação do
  // useEffect pelo StrictMode em dev). Como o refresh token é rotativo, uma segunda
  // chamada concorrente usaria o token já invalidado pela primeira e voltaria 401,
  // podendo derrubar a sessão mesmo com o refresh original tendo funcionado.
  const refreshRequestRef = useRef<ReturnType<typeof apiFetch> | null>(null);

  function refreshSession() {
    if (!refreshRequestRef.current) {
      refreshRequestRef.current = apiFetch("/auth/refresh", { method: "POST" }).finally(() => {
        refreshRequestRef.current = null;
      });
    }
    return refreshRequestRef.current;
  }

  useEffect(() => {
    refreshSession()
      .then(async (data) => {
        setAccessToken(data.accessToken);
        const profile = await apiFetch("/users/me", {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        setUser(profile);
      })
      .catch(() => setAccessToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string, rememberMe: boolean) {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe }),
    });
    setAccessToken(data.accessToken);
    const profile = await apiFetch("/users/me", {
      headers: { Authorization: `Bearer ${data.accessToken}` },
    });
    setUser(profile);
  }

  async function register(fullName: string, email: string, password: string, confirmPassword: string) {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, password, confirmPassword }),
    });
  }

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    setAccessToken(null);
    setUser(null);
  }

  async function refreshProfile() {
    if (!accessToken) return;
    const profile = await apiFetch("/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setUser(profile);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook fica junto do provider de propósito (padrão comum de contexto+hook)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
