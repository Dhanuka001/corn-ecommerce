"use client";

import { useState } from "react";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  const onChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.fullName || !form.email || !form.message) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setError("");
    setStatus("submitted");
    // TODO: connect to real endpoint
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full Name"
          required
          value={form.fullName}
          onChange={(v) => onChange("fullName", v)}
          placeholder="Enter your name"
        />
        <Field
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(v) => onChange("email", v)}
          placeholder="you@example.com"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Phone Number"
          value={form.phone}
          onChange={(v) => onChange("phone", v)}
          placeholder="+94 77 123 4567"
        />
        <Field
          label="Subject"
          value={form.subject}
          onChange={(v) => onChange("subject", v)}
          placeholder="How can we help?"
        />
      </div>
      <div>
        <Field
          label="Message"
          as="textarea"
          required
          value={form.message}
          onChange={(v) => onChange("message", v)}
          placeholder="Share details so we can assist you faster."
          rows={4}
        />
      </div>
      {error ? <p className="text-sm font-semibold text-[#ED1C24]">{error}</p> : null}
      {status === "submitted" ? (
        <p className="text-sm font-semibold text-emerald-600">
          Thanks! We received your message.
        </p>
      ) : null}
      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#ED1C24] text-sm font-semibold text-white shadow-sm transition hover:bg-[#d01921]"
      >
        Submit
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  as,
  rows = 3,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  as?: "textarea";
  rows?: number;
}) {
  const baseClasses =
    "w-full rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-900 shadow-inner outline-none transition focus:border-[#ED1C24] focus:ring-2 focus:ring-[#ED1C24]/15";

  return (
    <label className="space-y-1 text-sm font-semibold text-neutral-700">
      <span>
        {label} {required ? <span className="text-[#ED1C24]">*</span> : null}
      </span>
      {as === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </label>
  );
}
