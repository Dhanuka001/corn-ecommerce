"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { LoadingOverlay } from "@/components/loading-overlay";

type AuthMode = "login" | "register";

type AuthModalProps = {
  open: boolean;
  mode: AuthMode;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
  onRegister: (payload: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  onGoogleLogin: () => void;
};

const initialFormState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
};

export function AuthModal({
  open,
  mode,
  loading,
  error,
  onClose,
  onModeChange,
  onLogin,
  onRegister,
  onGoogleLogin,
}: AuthModalProps) {
  const [form, setForm] = useState(initialFormState);
  const resetForm = () => setForm(initialFormState);

  const title = mode === "login" ? "Welcome back" : "Create your account";
  const subtitle =
    mode === "login"
      ? "Sign in to track orders, wishlists, and more."
      : "Register to manage orders, wishlists, and device perks.";

  const googleLabel =
    mode === "login" ? "Continue with Google" : "Sign up with Google";

  const actionLabel = mode === "login" ? "Continue" : "Create account";

  const switchText =
    mode === "login"
      ? "New to PhoneBazzar.lk?"
      : "Already have an account?";
  const switchAction = mode === "login" ? "Register" : "Sign in";

  const canSubmit = useMemo(() => {
    if (!form.email || !form.password) return false;
    if (mode === "register" && !form.firstName) return false;
    return true;
  }, [form, mode]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    if (mode === "login") {
      await onLogin({
        email: form.email,
        password: form.password,
      });
    } else {
      await onRegister({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
      });
    }
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <LoadingOverlay visible={loading} background="transparent" />
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4 py-8 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
            aria-label="Close authentication dialog"
          >
            ×
          </button>
        </div>

        <button
          type="button"
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-primary/30 hover:text-primary"
          onClick={onGoogleLogin}
          disabled={loading}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <Image
              src="/google.png"
              alt="Google logo"
              width={16}
              height={16}
              className="h-6 w-6"
            />
          </span>
          {googleLabel}
        </button>

        <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-wide text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          or
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {mode === "register" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="text-slate-600">First name</span>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      firstName: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                  required
                />
              </label>
              <label className="text-sm">
                <span className="text-slate-600">Last name</span>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      lastName: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
                />
              </label>
            </div>
          )}

          <label className="text-sm">
            <span className="text-slate-600">Email address</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
              required
            />
          </label>

          <label className="text-sm">
            <span className="text-slate-600">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary"
              required
              minLength={8}
            />
          </label>

          {error && (
            <p className="rounded-2xl mt-4 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="mt-4 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-primary/50"
          >
            {loading ? "Please wait..." : actionLabel}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          {switchText}{" "}
          <button
            type="button"
            className="font-semibold text-primary"
            onClick={() => onModeChange(mode === "login" ? "register" : "login")}
          >
            {switchAction}
          </button>
        </p>
        </div>
      </div>
    </>
  );
}
