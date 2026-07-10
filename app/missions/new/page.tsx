"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewMissionPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Fitness");
  const [frequency, setFrequency] = useState("daily");
  const [target, setTarget] = useState(1);
  const [unit, setUnit] = useState("sessions");
  const [xp, setXp] = useState(20);
  const [completionBonus, setCompletionBonus] = useState(0);
  const [requiredForStreak, setRequiredForStreak] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("Current User:", user);

      if (!user) {
        router.push("/auth");
        return;
      }

      setUserId(user.id);
    }

    loadUser();
  }, [router]);

  async function saveMission() {
    if (!userId) {
      alert("No logged in user found.");
      return;
    }

    if (!name.trim()) {
      alert("Please enter a mission name.");
      return;
    }

    setLoading(true);

    console.log("Saving mission...");

    const { data, error } = await supabase
      .from("missions")
      .insert({
        user_id: userId,
        name,
        category,
        frequency,
        target,
        progress: 0,
        unit,
        xp,
        completion_bonus: completionBonus,
        required_for_streak: requiredForStreak,
        active: true,
      })
      .select();

    console.log("Data:", data);
    console.log("Error:", error);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/profile/missions");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-md px-6 py-8">
        <button
  onClick={() => router.back()}
  className="mb-6 flex items-center gap-2 text-zinc-400 transition hover:text-white"
>
  <ArrowLeft size={18} />
  Back
</button>

        <h1 className="text-4xl font-bold">
          New Mission
        </h1>

        <p className="mt-2 text-zinc-400">
          Create a mission for your 153% journey.
        </p>

        <div className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Mission Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Gym"
              className="w-full rounded-xl bg-zinc-900 p-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Category
            </label>

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
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Frequency
            </label>

            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 p-4"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Target
            </label>

            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full rounded-xl bg-zinc-900 p-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Unit
            </label>

            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="sessions"
              className="w-full rounded-xl bg-zinc-900 p-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              XP Reward
            </label>

            <input
              type="number"
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              className="w-full rounded-xl bg-zinc-900 p-4"
            />
          </div>
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

          <label className="flex items-center justify-between rounded-xl bg-zinc-900 p-4">
            <span>Counts towards streak</span>

            <input
              type="checkbox"
              checked={requiredForStreak}
              onChange={(e) => setRequiredForStreak(e.target.checked)}
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
    disabled={loading}
    className="flex-1 rounded-xl bg-emerald-500 p-4 font-bold text-black transition hover:bg-emerald-400 disabled:opacity-50"
  >
    {loading ? "Saving..." : "Save"}
  </button>

</div>

        </div>

      </div>
    </main>
  );
}