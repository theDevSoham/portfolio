"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials");
      setSubmitting(false);
    } else {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-96"
      >
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full mb-3 px-3 py-2 bg-gray-700 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full mb-3 px-3 py-2 bg-gray-700 rounded"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
