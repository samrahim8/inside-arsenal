"use client";

import { useState } from "react";

interface SignupFormProps {
  utmSource?: string;
  subtext?: string;
}

export default function SignupForm({
  utmSource = "hero",
  subtext = "Free weekly. Every Friday. The best Arsenal content, curated.",
}: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, utmSource }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center animate-fade-up">
        <p className="text-xl font-serif text-white">You&apos;re in.</p>
        <p className="text-[rgba(255,255,255,0.7)] mt-2">Check your inbox.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your email"
          disabled={status === "loading"}
          className="flex-1 px-4 py-3 bg-surface border border-subtle rounded-lg text-white placeholder:text-[rgba(255,255,255,0.3)] focus:outline-none focus:border-arsenal transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading" || !email}
          className="px-6 py-3 bg-arsenal text-white font-medium rounded-lg hover:bg-[#dc2626] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-2 text-sm text-arsenal">{errorMessage}</p>
      )}

      <p className="mt-3 text-sm text-[rgba(255,255,255,0.45)]">{subtext}</p>
    </form>
  );
}
