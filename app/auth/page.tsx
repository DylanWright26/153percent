"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) throw error;
      } else {
        const { error } =
          await supabase.auth.signUp({
            email,
            password,
          });

        if (error) throw error;
      }

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <h1 className="text-center text-6xl font-bold">
          153%
        </h1>

        <p className="mt-4 text-center text-zinc-400">
          Getting 1% Better, Every Day
        </p>

        <div className="mt-10 rounded-3xl bg-zinc-900 p-6">

          <h2 className="text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          <input
            className="mt-6 w-full rounded-xl bg-zinc-800 p-4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="mt-4 w-full rounded-xl bg-zinc-800 p-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-emerald-500 p-4 font-semibold text-black hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-6 w-full text-sm text-zinc-400 hover:text-white"
          >
            {isLogin
              ? "Don't have an account? Create one"
              : "Already have an account? Sign In"}
          </button>

        </div>

      </div>
    </main>
  );
}