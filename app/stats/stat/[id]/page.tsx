"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import StatModal, { Stat } from "@/components/stats/StatModal";

type History = {
  id: string;
  value: string;
  created_at: string;
};

export default function StatPage() {
  const params = useParams();

  const statId = params.id as string;

  const [stat, setStat] = useState<Stat | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    loadStat();
  }, []);

  async function loadStat() {
    const { data } = await supabase
      .from("stats")
      .select("*")
      .eq("id", statId)
      .single();

    setStat(data);

    const { data: historyData } = await supabase
      .from("stat_history")
      .select("*")
      .eq("stat_id", statId)
      .order("created_at", {
        ascending: false,
      });

    setHistory(historyData ?? []);
  }

  async function updateValue() {
    if (!newValue.trim()) return;

    const { error } = await supabase
      .from("stats")
      .update({
        current_value: newValue,
      })
      .eq("id", statId);

    if (error) {
      alert(error.message);
      return;
    }

    await supabase
      .from("stat_history")
      .insert({
        stat_id: statId,
        value: newValue,
      });

    setShowUpdate(false);
    setNewValue("");

    await loadStat();
  }

  async function deleteStat() {
    const confirmed = window.confirm(
      "Delete this stat and all of its history?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("stats")
      .delete()
      .eq("id", statId);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = `/stats/category/${stat?.category_id}`;
  }

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 text-white">

      <div className="mx-auto max-w-md px-6 py-8">

        <Link
          href={`/stats/category/${stat?.category_id}`}
          className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          ← Back
        </Link>

        <h1 className="text-4xl font-bold">
          {stat?.name}
        </h1>

        <div className="mt-8 rounded-3xl bg-zinc-900 p-6">

          <p className="text-sm uppercase tracking-wider text-zinc-500">
            Current Value
          </p>

          <p className="mt-4 text-5xl font-black">
            {stat?.current_value}
            {stat?.unit && ` ${stat.unit}`}
          </p>

          {!showUpdate ? (

            <button
              onClick={() => setShowUpdate(true)}
              className="mt-6 w-full rounded-xl bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400"
            >
              Update Value
            </button>

          ) : (

            <div className="mt-6 space-y-3">

              <input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter new value..."
                className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
              />

              <div className="flex gap-3">

                <button
                  onClick={() => {
                    setShowUpdate(false);
                    setNewValue("");
                  }}
                  className="flex-1 rounded-xl bg-zinc-800 py-3 hover:bg-zinc-700"
                >
                  Cancel
                </button>

                <button
                  onClick={updateValue}
                  className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400"
                >
                  Save
                </button>

              </div>

            </div>

          )}

        </div>

        <div className="mt-8 rounded-3xl bg-zinc-900 p-6">

          <h2 className="text-xl font-bold">
            History
          </h2>

          {history.length === 0 ? (

            <p className="mt-4 text-zinc-500">
              No history yet.
            </p>

          ) : (

            <div className="mt-4 space-y-3">

              {history.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-zinc-800 p-3"
                >

                  <span className="text-lg font-semibold">
                    {item.value}
                  </span>

                  <span className="text-sm text-zinc-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

        <div className="mt-8 space-y-3">

          <button
            onClick={() => setShowEditModal(true)}
            className="w-full rounded-xl bg-zinc-800 py-3 font-semibold hover:bg-zinc-700"
          >
            ✏️ Edit Stat
          </button>

          <button
            onClick={deleteStat}
            className="w-full rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-400"
          >
            🗑 Delete Stat
          </button>

        </div>

      </div>

      {showEditModal && stat && (

        <StatModal
          categoryId={stat.category_id}
          stat={stat}
          onClose={() => setShowEditModal(false)}
          onSaved={async () => {
            await loadStat();
            setShowEditModal(false);
          }}
        />

      )}

    </main>
  );
}