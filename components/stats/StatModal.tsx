"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export type Stat = {
  id: string;
  name: string;
  current_value: string;
  unit: string | null;
  category_id: string;
};

type Props = {
  categoryId: string;
  onClose: () => void;
  onSaved: () => void;
  stat?: Stat;
};

export default function StatModal({
  categoryId,
  onClose,
  onSaved,
  stat,
}: Props) {
  const [name, setName] = useState(
    stat?.name ?? ""
  );

  const [currentValue, setCurrentValue] = useState(
    stat?.current_value ?? ""
  );

  const [unit, setUnit] = useState(
    stat?.unit ?? ""
  );

  async function saveStat() {
    if (!name.trim() || !currentValue.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    let error;

    if (stat) {
      const result = await supabase
        .from("stats")
        .update({
          name,
          current_value: currentValue,
          unit: unit || null,
        })
        .eq("id", stat.id);

      error = result.error;
    } else {
      const result = await supabase
        .from("stats")
        .insert({
          user_id: user.id,
          category_id: categoryId,
          name,
          current_value: currentValue,
          unit: unit || null,
        })
        .select()
        .single();

      error = result.error;

      if (!error && result.data) {
        await supabase
          .from("stat_history")
          .insert({
            stat_id: result.data.id,
            value: currentValue,
          });
      }
    }

    if (error) {
      alert(error.message);
      return;
    }

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-6">

      <div className="mx-auto my-8 w-full max-w-md rounded-3xl bg-zinc-900 p-6">

        <h2 className="text-2xl font-bold">
          {stat ? "✏️ Edit Stat" : "📊 Add Stat"}
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          {stat
            ? "Update this stat."
            : "Track something important."}
        </p>

        <div className="mt-6 space-y-5">

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Current Value
            </label>

            <input
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Unit (optional)
            </label>

            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="kg, mins, £..."
              className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
            />
          </div>

        </div>

        <div className="mt-8 flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-zinc-800 py-3 hover:bg-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={saveStat}
            className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400"
          >
            {stat ? "Save Changes" : "Create"}
          </button>

        </div>

      </div>

    </div>
  );
}