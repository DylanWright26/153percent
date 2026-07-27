"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Mission } from "@/context/AppContext";

const categories = [
  "Fitness",
  "Health",
  "Football",
  "Finance",
  "Career",
  "Learning",
  "Personal",
  "Other",
];

type Props = {
  onClose: () => void;
  onSaved: () => void;
  mission?: Mission;
};

export default function MissionModal({
  onClose,
  onSaved,
  mission,
}: Props) {

  const [title, setTitle] = useState(
    mission?.name ?? ""
  );

  const [description, setDescription] = useState(
    mission?.description ?? ""
  );

  const [category, setCategory] = useState(
    mission?.category ?? "Fitness"
  );

  const [frequency, setFrequency] = useState(
    mission?.frequency ?? "daily"
  );

  const [target, setTarget] = useState(
    mission?.target ?? 1
  );

  const [unit, setUnit] = useState(
    mission?.unit ?? "sessions"
  );

  const [xpReward, setXpReward] = useState(
    mission?.xp ?? 20
  );

  const [completionBonus, setCompletionBonus] = useState(
    mission?.completion_bonus ?? 0
  );

  const [requiredForStreak, setRequiredForStreak] = useState(
    mission?.required_for_streak ?? true
  );

  const [loading, setLoading] = useState(false);


  async function saveMission() {

    if (!title.trim()) {
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) {
      setLoading(false);
      return;
    }


    let error;


    if (mission) {

      const result = await supabase
        .from("missions")
        .update({
          name: title,
          description,
          category,
          frequency,
          target,
          unit,
          xp: xpReward,
          completion_bonus: completionBonus,
          required_for_streak: requiredForStreak,
        })
        .eq("id", mission.id);

      error = result.error;


    } else {

      const result = await supabase
        .from("missions")
        .insert({
          user_id: user.id,
          name: title,
          description,
          category,
          frequency,
          target,
          progress: 0,
          unit,
          xp: xpReward,
          completion_bonus: completionBonus,
          required_for_streak: requiredForStreak,
          active: true,
        });

      error = result.error;
    }


    setLoading(false);


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
          {mission
            ? "✏️ Edit Mission"
            : "📅 Create Mission"}
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          {mission
            ? "Update your mission details."
            : "Create a repeatable habit or task for your 153% journey."}
        </p>

        <div className="mt-6 space-y-6">
                  {/* Title */}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Drink 3L of Water"
            className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Give your mission a short, clear name.
          </p>
        </div>


        {/* Description */}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Description
          </label>

          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what needs to be achieved..."
            className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Optional. Add extra details or instructions.
          </p>
        </div>


        {/* Category */}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
          >
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs text-zinc-500">
            Helps organise your missions.
          </p>
        </div>


        {/* Frequency */}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Frequency
          </label>

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
          >
            <option value="daily">
              Daily
            </option>

            <option value="weekly">
              Weekly
            </option>

            <option value="monthly">
              Monthly
            </option>
          </select>

          <p className="mt-2 text-xs text-zinc-500">
            Choose when this mission resets.
          </p>
        </div>


        {/* Target */}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Target
          </label>

          <div className="grid grid-cols-2 gap-3">

            <input
              type="number"
              min={1}
              value={target}
              onChange={(e) =>
                setTarget(Number(e.target.value))
              }
              className="rounded-xl bg-zinc-800 p-3 outline-none"
            />


            <input
              value={unit}
              onChange={(e) =>
                setUnit(e.target.value)
              }
              placeholder="sessions"
              className="rounded-xl bg-zinc-800 p-3 outline-none"
            />

          </div>

          <p className="mt-2 text-xs text-zinc-500">
            Example: 3 litres, 20 pages, 1 workout.
          </p>
        </div>
                {/* XP Reward */}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            XP Reward
          </label>

          <input
            type="number"
            min={0}
            value={xpReward}
            onChange={(e) =>
              setXpReward(Number(e.target.value))
            }
            className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Earn{" "}
            <span className="font-semibold text-green-400">
              {xpReward} XP
            </span>{" "}
            every time this mission is completed.
          </p>
        </div>


        {/* Completion Bonus */}

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Completion Bonus
          </label>

          <input
            type="number"
            min={0}
            value={completionBonus}
            onChange={(e) =>
              setCompletionBonus(Number(e.target.value))
            }
            className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Earn an additional{" "}
            <span className="font-semibold text-green-400">
              {completionBonus} XP
            </span>{" "}
            when the mission is fully completed.
          </p>
        </div>


        {/* Maintain Daily Streak */}

        <div className="rounded-xl bg-zinc-800 p-4">

          <div className="flex items-center justify-between">

            <div>

              <h3 className="font-medium text-zinc-200">
                Maintain Daily Streak
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Completing this mission helps maintain your streak.
              </p>

            </div>

            <input
              type="checkbox"
              checked={requiredForStreak}
              onChange={(e) =>
                setRequiredForStreak(e.target.checked)
              }
              className="h-5 w-5"
            />

          </div>

        </div>


      </div>


      {/* Buttons */}

      <div className="mt-8 flex gap-3">

        <button
          onClick={onClose}
          className="flex-1 rounded-xl bg-zinc-800 py-3 font-medium hover:bg-zinc-700"
        >
          Cancel
        </button>


        <button
          disabled={loading}
          onClick={saveMission}
          className="flex-1 rounded-xl bg-green-600 py-3 font-semibold hover:bg-green-500 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : mission
              ? "Save Changes"
              : "Create Mission"}
        </button>

      </div>


    </div>

  </div>
  );
}