"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

import StatModal from "@/components/stats/StatModal";
import BackButton from "@/components/common/BackButton";

type Category = {
  id: string;
  name: string;
};

type Stat = {
  id: string;
  name: string;
  current_value: string;
  unit: string | null;
};

export default function CategoryPage() {
  const params = useParams();

  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setLoading(true);

    const { data: categoryData } = await supabase
      .from("stat_categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    setCategory(categoryData);

    const { data: statsData } = await supabase
      .from("stats")
      .select("*")
      .eq("category_id", categoryId)
      .order("created_at");

    setStats(statsData ?? []);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-24">

      <div className="mx-auto max-w-md px-6 py-8">

        <BackButton href="/stats" />

        <h1 className="text-4xl font-bold">
          {category?.name}
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 p-4 font-semibold text-black hover:bg-emerald-400"
        >
          <Plus size={20} />
          Add Stat
        </button>

        {loading ? (

          <div className="mt-8 text-zinc-500">
            Loading...
          </div>

        ) : stats.length === 0 ? (

          <div className="mt-8 rounded-3xl bg-zinc-900 p-6">

            <h2 className="text-xl font-semibold">
              No stats yet
            </h2>

            <p className="mt-2 text-zinc-500">
              Add your first stat.
            </p>

          </div>

        ) : (

          <div className="mt-8 space-y-4">

            {stats.map((stat) => (

              <Link
                key={stat.id}
                href={`/stats/stat/${stat.id}`}
                className="block rounded-3xl bg-zinc-900 p-5 transition hover:bg-zinc-800"
              >

                <h2 className="text-xl font-bold">
                  {stat.name}
                </h2>

                <p className="mt-3 text-3xl font-black">
                  {stat.current_value}
                  {stat.unit && ` ${stat.unit}`}
                </p>

              </Link>

            ))}

          </div>

        )}

      </div>

      {showModal && (
        <StatModal
          categoryId={categoryId}
          onClose={() => setShowModal(false)}
          onSaved={async () => {
            await loadPage();
            setShowModal(false);
          }}
        />
      )}

    </main>
  );
}