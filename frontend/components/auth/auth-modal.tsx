"use client";

import { useMemo, useState } from "react";

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
};

const initialFormState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
};

const GoogleLogo = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 46 46"
    aria-hidden
  >
    <g fill="none" fillRule="evenodd">
      <path
        d="M23 9c3.25 0 5.5 1.4 6.77 2.57l4.96-4.82C31.9 4.08 27.82 2 23 2 13.66 2 5.79 7.98 2.64 16.23l5.81 4.52C9.57 14.51 15.7 9 23 9Z"
        fill="#EA4335"
      />
      <path
        d="M44.02 24.5c0-1.55-.14-3.04-.4-4.48H23v8.48h11.73c-.5 2.63-2.03 4.86-4.33 6.36l6.82 5.29C41.42 35.92 44.02 30.73 44.02 24.5Z"
        fill="#4285F4"
      />
      <path
        d="M8.45 20.75a13.94 13.94 0 0 0 0 10.51l-5.81 4.52C.9 32.16 0 28.46 0 24.5s.9-7.66 2.64-11.28l5.81 4.52Z"
        fill="#FBBC05"
      />
      <path
        d="M23 44c4.82 0 8.88-1.59 11.85-4.33l-6.82-5.29c-1.9 1.27-4.34 2.02-5.03 2.02-5.38 0-9.96-3.62-11.55-8.55l-5.81 4.52C5.79 41.02 13.66 44 23 44Z"
        fill="#34A853"
      />
      <path d="M0 0h46v46H0z" />
    </g>
  </svg>
);

export function AuthModal({
  open,
  mode,
  loading,
  error,
  onClose,
  onModeChange,
  onLogin,
  onRegister,
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
      ? "New to Corn Electronics?"
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
          disabled
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <GoogleLogo />
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
          className="space-y-4"
        >
          {mode === "register" && (
            <div className="grid gap-3 sm:grid-cols-2">
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
            <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="mt-2 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-primary/50"
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
  );
}
