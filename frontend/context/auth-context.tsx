"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { apiRequest } from "@/lib/api";
import { AuthModal } from "@/components/auth/auth-modal";

type User = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
};

type AuthMode = "login" | "register";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<AuthMode>("login");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await apiRequest<{ user: User }>("/auth/me", {
        method: "GET",
      });
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const openAuth = useCallback((mode: AuthMode = "login") => {
    setModalMode(mode);
    setFormError(null);
    setModalOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setModalOpen(false);
    setFormError(null);
  }, []);

  const handleLogin = useCallback(
    async (payload: { email: string; password: string }) => {
      setFormLoading(true);
      setFormError(null);
      try {
        const data = await apiRequest<{ user: User }>("/auth/login", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setUser(data.user);
        closeAuth();
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Login failed");
      } finally {
        setFormLoading(false);
      }
    },
    [closeAuth],
  );

  const handleRegister = useCallback(
    async (payload: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
    }) => {
      setFormLoading(true);
      setFormError(null);
      try {
        const data = await apiRequest<{ user: User }>("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setUser(data.user);
        closeAuth();
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : "Registration failed",
        );
      } finally {
        setFormLoading(false);
      }
    },
    [closeAuth],
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      openAuth,
      closeAuth,
      logout,
    }),
    [user, loading, openAuth, closeAuth, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      {modalOpen && (
        <AuthModal
          open={modalOpen}
          mode={modalMode}
          loading={formLoading}
          error={formError}
          onClose={closeAuth}
          onModeChange={setModalMode}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
