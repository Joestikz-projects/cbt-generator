"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Wrong password.");
    }
  }

  return (
    <main className="min-h-screen hall-texture flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="paper-card rounded-sm p-8 w-full max-w-sm"
      >
        <p className="font-mono text-xs tracking-widest text-muted uppercase mb-2">
          Private
        </p>
        <h1 className="font-display text-2xl font-semibold mb-6">
          Enter password
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-paperLine rounded-sm p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-marker"
          placeholder="Password"
          autoFocus
        />
        {error && <p className="text-sm text-[#e2584f] mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-ink text-paper font-mono text-sm uppercase tracking-wide px-6 py-2.5 rounded-sm hover:bg-marker hover:text-ink transition-colors"
        >
          Enter
        </button>
      </form>
    </main>
  );
}
