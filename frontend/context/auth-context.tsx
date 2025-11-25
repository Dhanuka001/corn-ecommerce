"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { apiRequest } from "@/lib/api";
import { AuthModal } from "@/components/auth/auth-modal";
import { useNotifications } from "@/context/notification-context";

type User = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  role: string;
  suspended: boolean;
};

type AuthMode = "login" | "register";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<AuthMode>("login");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const googleInitializedRef = useRef(false);
  const { notifySuccess, notifyError } = useNotifications();

  const resolveUserGreeting = useCallback((currentUser: User) => {
    if (currentUser.firstName) {
      return currentUser.firstName;
    }
    if (currentUser.email) {
      return currentUser.email.split("@")[0] || currentUser.email;
    }
    return "there";
  }, []);

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
        notifySuccess(
          "Signed in",
          `Welcome back, ${resolveUserGreeting(data.user)}.`,
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Login failed";
        setFormError(message);
        notifyError("Login failed", message);
      } finally {
        setFormLoading(false);
      }
    },
    [closeAuth, notifyError, notifySuccess, resolveUserGreeting],
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
        notifySuccess(
          "Account created",
          `${resolveUserGreeting(data.user)}, your profile is ready.`,
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Registration failed";
        setFormError(message);
        notifyError("Registration failed", message);
      } finally {
        setFormLoading(false);
      }
    },
    [closeAuth, notifyError, notifySuccess, resolveUserGreeting],
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      notifySuccess("Signed out", "You have been logged out.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign out.";
      notifyError("Logout failed", message);
    } finally {
      setUser(null);
    }
  }, [notifyError, notifySuccess]);

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setFormLoading(true);
      setFormError(null);
      try {
        const data = await apiRequest<{ user: User }>("/auth/google", {
          method: "POST",
          body: JSON.stringify({ credential }),
        });
        setUser(data.user);
        closeAuth();
        notifySuccess(
          "Signed in with Google",
          `Welcome, ${resolveUserGreeting(data.user)}.`,
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Google sign-in failed. Please try again.";
        setFormError(message);
        notifyError("Google sign-in failed", message);
      } finally {
        setFormLoading(false);
      }
    },
    [closeAuth, notifyError, notifySuccess, resolveUserGreeting],
  );

  const initializeGoogle = useCallback(() => {
    if (!googleClientId || googleInitializedRef.current) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    const google = window.google;
    if (!google?.accounts?.id) {
      return;
    }

    google.accounts.id.initialize({
      client_id: googleClientId,
      auto_select: false,
      ux_mode: "popup",
      state_cookie_domain: window.location.hostname,
      itp_support: true,
      callback: (response) => {
        if (response.credential) {
          void handleGoogleCredential(response.credential);
        } else {
          setFormError(
            "Google didn't return a credential. Please try again.",
          );
        }
      },
    });
    googleInitializedRef.current = true;
  }, [handleGoogleCredential]);

  useEffect(() => {
    if (!googleClientId) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }
    const handler = () => initializeGoogle();
    document.addEventListener("google-identity-service-loaded", handler);
    return () => {
      document.removeEventListener("google-identity-service-loaded", handler);
    };
  }, [initializeGoogle]);

  const loginWithGoogle = useCallback(() => {
    if (!googleClientId) {
      setFormError("Google login is not configured.");
      return;
    }
    if (typeof window === "undefined" || !window.google?.accounts?.id) {
      setFormError(
        "Google services are still loading. Please try again in a moment.",
      );
      return;
    }
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        const reason = notification.getNotDisplayedReason();
        setFormError(
          reason === "suppressed_by_user"
            ? "Google sign-in popup was blocked by the browser."
            : `Google sign-in could not start (${reason}).`,
        );
        return;
      }
      if (!notification.isDismissedMoment()) {
        return;
      }
      const dismissReason = notification.getDismissedReason();
      if (dismissReason === "credential_returned") {
        return;
      }
      setFormError(
        dismissReason === "cancel_called"
          ? "Google sign-in was canceled before completion."
          : "Google sign-in was dismissed. Please try again.",
      );
    }, {
      // FedCM can reject on some browsers without HTTPS. Fallback to popup.
      use_fedcm_for_prompt: false,
    } as unknown as never);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      openAuth,
      closeAuth,
      loginWithGoogle,
      logout,
    }),
    [user, loading, openAuth, closeAuth, loginWithGoogle, logout],
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
          onGoogleLogin={loginWithGoogle}
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
