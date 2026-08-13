"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

export default function SettingsPage() {

  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadUser() {

      const {

        data: { user },

      } = await supabase.auth.getUser();

      setEmail(user?.email ?? null);

      setLoading(false);

    }

    loadUser();

  }, []);

  async function handleLogout() {

    await supabase.auth.signOut();

    router.push("/auth");

    router.refresh();

  }

  return (

    <main className="min-h-screen bg-zinc-950 text-white">

      <div className="mx-auto max-w-md px-6 py-8">

        <Link

          href="/account"

          className="text-lg text-zinc-400 transition hover:text-white"

        >

          ← Back

        </Link>

        <h1 className="mt-8 text-4xl font-bold">

          ⚙️ Settings

        </h1>

        <p className="mt-2 text-zinc-400">

          Manage your account and app settings.

        </p>

        <section className="mt-10 rounded-3xl bg-zinc-900 p-6">

          <h2 className="text-2xl font-bold">

            🔐 Account

          </h2>

          {loading ? (

            <p className="mt-5 text-zinc-500">

              Loading...

            </p>

          ) : email ? (

            <>

              <div className="mt-6 rounded-2xl bg-zinc-800 p-5">

                <p className="text-sm text-zinc-500">

                  Logged in as

                </p>

                <p className="mt-2 break-all text-xl font-bold">

                  {email}

                </p>

              </div>

              <button

                onClick={handleLogout}

                className="mt-6 w-full rounded-2xl bg-red-950 p-5 text-xl font-bold text-red-400 transition hover:bg-red-900"

              >

                Log Out

              </button>

            </>

          ) : (

            <>

              <p className="mt-5 text-zinc-400">

                Log in to sync your 153% progress across your devices.

              </p>

              <Link

                href="/auth"

                className="mt-6 block w-full rounded-2xl bg-emerald-500 p-5 text-center text-xl font-bold text-black transition hover:bg-emerald-400"

              >

                Log In

              </Link>

            </>

          )}

        </section>

      </div>

    </main>

  );

}