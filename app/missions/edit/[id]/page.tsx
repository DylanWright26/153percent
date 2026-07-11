"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";

export default function EditMissionPage() {
  const router = useRouter();
  const { refreshMissions, refreshProfile } = useApp();
  const params = useParams();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Fitness");
  const [frequency, setFrequency] = useState("daily");
  const [target, setTarget] = useState(1);
  const [unit, setUnit] = useState("sessions");
  const [xp, setXp] = useState(20);
  const [completionBonus, setCompletionBonus] = useState(0);
  const [requiredForStreak, setRequiredForStreak] = useState(true);

  useEffect(() => {
    loadMission();
  }, []);

  async function loadMission() {
    const { data, error } = await supabase
      .from("missions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      router.push("/profile/missions");
      return;
    }

    setName(data.name);
    setCategory(data.category);
    setFrequency(data.frequency);
    setTarget(data.target);
    setUnit(data.unit);
    setXp(data.xp);
    setCompletionBonus(data.completion_bonus);
    setRequiredForStreak(data.required_for_streak);

    setLoading(false);
  }

  async function saveMission() {
    setSaving(true);

    const { error } = await supabase
      .from("missions")
      .update({
        name,
        category,
        frequency,
        target,
        unit,
        xp,
        completion_bonus: completionBonus,
        required_for_streak: requiredForStreak,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

   await refreshMissions();
await refreshProfile();

router.push("/");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-md px-6 py-8"><button
  onClick={() => router.back()}
  className="mb-6 flex items-center gap-2 text-zinc-400 transition hover:text-white"
>
  <ArrowLeft size={18} />
  Back
</button>

        <h1 className="text-4xl font-bold">
          Edit Mission
        </h1>

        <div className="mt-8 space-y-5">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mission Name"
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          >
            <option>Fitness</option>
            <option>Health</option>
            <option>Learning</option>
            <option>Finance</option>
            <option>Career</option>
            <option>Mindset</option>
            <option>Relationships</option>
          </select>

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

<div>
  <label className="mb-2 block text-sm text-zinc-400">
    Completion Bonus XP
  </label>

  <input
    type="number"
    value={completionBonus}
    onChange={(e) => setCompletionBonus(Number(e.target.value))}
    className="w-full rounded-xl bg-zinc-900 p-4"
  />
</div>

          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <input
            type="number"
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            className="w-full rounded-xl bg-zinc-900 p-4"
          />

          <label className="flex items-center justify-between rounded-xl bg-zinc-900 p-4">
            <span>Counts towards streak</span>

            <input
              type="checkbox"
              checked={requiredForStreak}
              onChange={(e) =>
                setRequiredForStreak(e.target.checked)
              }
            />
          </label>

          <div className="flex gap-4">

  <button
    onClick={() => router.back()}
    className="flex-1 rounded-xl bg-zinc-800 p-4 font-semibold transition hover:bg-zinc-700"
  >
    Cancel
  </button>

  <button
    onClick={saveMission}
    disabled={saving}
    className="flex-1 rounded-xl bg-emerald-500 p-4 font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
  >
    {saving ? "Saving..." : "Save Changes"}
  </button>

</div>

        </div>

      </div>
    </main>
  );
}