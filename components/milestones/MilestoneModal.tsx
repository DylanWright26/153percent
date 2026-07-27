"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

export interface Milestone {
  id: string;
  title: string;
  description: string | null;
  category: string;
  xp_reward: number;
  completed: boolean;
}

type Props = {
  onClose: () => void;
  onSaved: () => void;
  milestone?: Milestone;
};

export default function MilestoneModal({
  onClose,
  onSaved,
  milestone,
}: Props) {

  const [title, setTitle] = useState(
    milestone?.title ?? ""
  );

  const [description, setDescription] = useState(
    milestone?.description ?? ""
  );

  const [category, setCategory] = useState(
    milestone?.category ?? "Personal"
  );

  const [xpReward, setXpReward] = useState(
    milestone?.xp_reward ?? 250
  );

  const [loading, setLoading] = useState(false);


  async function saveMilestone() {

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


    if (milestone) {

      const result = await supabase
        .from("milestones")
        .update({
          title,
          description,
          category,
          xp_reward: xpReward,
        })
        .eq("id", milestone.id);


      error = result.error;


    } else {

      const result = await supabase
        .from("milestones")
        .insert({
          user_id: user.id,
          title,
          description,
          category,
          xp_reward: xpReward,
          completed: false,
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
          {milestone
            ? "✏️ Edit Milestone"
            : "🏁 Create Milestone"}
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          {milestone
            ? "Update your milestone details."
            : "Create a long-term goal that stays completed forever."}
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
            placeholder="e.g. Run a 5K under 25 minutes"
            className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Give your milestone a clear goal.
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
            placeholder="Describe what achieving this milestone means..."
            className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Optional. Add extra details about the goal.
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
            Organise your milestones.
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
            when this milestone is completed.
          </p>
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
          onClick={saveMilestone}
          className="flex-1 rounded-xl bg-green-600 py-3 font-semibold hover:bg-green-500 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : milestone
              ? "Save Changes"
              : "Create Milestone"}
        </button>

      </div>


    </div>

  </div>
  );
}