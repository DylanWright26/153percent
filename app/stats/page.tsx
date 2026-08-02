"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import BackButton from "@/components/common/BackButton";

const DEFAULT_CATEGORIES = [
  "Fitness",
  "Football",
  "Money",
  "Personal",
  "Gaming",
  "Learning",
  "Career",
  "Other",
];

type Category = {
  id: string;
  name: string;
};

export default function StatsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    let { data } = await supabase
      .from("stat_categories")
      .select("*")
      .eq("user_id", user.id)
      .order("name");

    if (!data || data.length === 0) {
      await supabase.from("stat_categories").insert(
        DEFAULT_CATEGORIES.map((name) => ({
          user_id: user.id,
          name,
        }))
      );

      const result = await supabase
        .from("stat_categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      data = result.data ?? [];
    }

    setCategories(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-24">

      <div className="mx-auto max-w-md px-6 py-8">

        <BackButton href="/progress" />

        <h1 className="text-4xl font-bold">
          📊 Stats
        </h1>

        <p className="mt-2 text-zinc-500">
          Track your progress across every area of life.
        </p>

        {loading ? (

          <div className="mt-8 text-zinc-500">
            Loading...
          </div>

        ) : (

          <div className="mt-8 space-y-4">

            {categories.map((category) => (

              <Link
                key={category.id}
                href={`/stats/category/${category.id}`}
                className="block rounded-3xl bg-zinc-900 p-6 transition hover:bg-zinc-800"
              >

                <h2 className="text-2xl font-bold">
                  {category.name}
                </h2>

              </Link>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}