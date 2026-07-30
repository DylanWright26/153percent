"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";
import { checkAchievements } from "@/utils/achievements";
import { checkRewards } from "@/lib/rewards";

import MilestoneModal, {
  Milestone,
} from "@/components/milestones/MilestoneModal";

const categories = [
  "All",
  "Fitness",
  "Health",
  "Football",
  "Finance",
  "Career",
  "Learning",
  "Personal",
  "Other",
];

export default function MilestonesPage() {
  const { refreshProfile } = useApp();

  const [milestones, setMilestones] =
    useState<Milestone[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedMilestone, setSelectedMilestone] =
    useState<Milestone | null>(null);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  useEffect(() => {
    loadMilestones();
  }, []);

  const filteredMilestones = useMemo(() => {
    if (selectedCategory === "All") {
      return milestones;
    }

    return milestones.filter(
      (milestone) =>
        milestone.category === selectedCategory
    );
  }, [milestones, selectedCategory]);

  async function loadMilestones() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .eq("user_id", user.id)
      .order("completed", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(error);
    }

const sortedMilestones = [...(data ?? [])].sort((a, b) => {
  if (a.completed !== b.completed) {
    return Number(a.completed) - Number(b.completed);
  }

  return (
    new Date(a.created_at).getTime() -
    new Date(b.created_at).getTime()
  );
});

setMilestones(sortedMilestones);
    setLoading(false);
  }

  async function completeMilestone(
    milestone: Milestone
  ) {
    if (milestone.completed) {
      return;
    }

    const { error } = await supabase
      .from("milestones")
      .update({
        completed: true,
      })
      .eq("id", milestone.id);

    if (error) {
      alert(error.message);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error: xpError } =
        await supabase.rpc("add_xp", {
          p_user_id: user.id,
          p_amount: milestone.xp_reward,
        });

      if (xpError) {
        alert(xpError.message);
        return;
      }

      await checkAchievements(user.id);

      await checkRewards(
        user.id,
        "milestone",
        milestone.id
      );
    }

    await refreshProfile();
    await loadMilestones();
  }

  async function deleteMilestone(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this milestone?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("milestones")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadMilestones();
  }

  function openCreateModal() {
    setSelectedMilestone(null);
    setShowModal(true);
  }

  function openEditModal(
    milestone: Milestone
  ) {
    setSelectedMilestone(milestone);
    setShowModal(true);
  }

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 text-white">
      <div className="mx-auto max-w-md px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              🏁 Milestones
            </h1>

            <p className="mt-2 text-zinc-500">
              Long-term goals that never reset.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="rounded-xl bg-green-600 px-4 py-2 font-semibold hover:bg-green-500"
          >
            + Add
          </button>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-green-600 text-black"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 text-zinc-500">
            Loading...
          </div>
        ) : filteredMilestones.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold">
              No milestones found
            </h2>

            <p className="mt-3 text-zinc-400">
              Try another category or create a new milestone.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {filteredMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="rounded-3xl bg-zinc-900 p-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {milestone.title}
                  </h2>

                  <span className="font-medium text-green-400">
                    +{milestone.xp_reward} XP
                  </span>
                </div>
                                {milestone.category && (
                  <span className="mt-3 inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-green-400">
                    {milestone.category}
                  </span>
                )}

                {milestone.description && (
                  <p className="mt-3 text-zinc-400">
                    {milestone.description}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    {milestone.completed ? (
                      <span className="font-medium text-green-400">
                        ✅ Completed
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          completeMilestone(milestone)
                        }
                        className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-black hover:bg-green-500"
                      >
                        Complete
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        openEditModal(milestone)
                      }
                      className="rounded-xl bg-zinc-800 p-2 hover:bg-zinc-700"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        deleteMilestone(milestone.id)
                      }
                      className="rounded-xl bg-red-500/20 p-2 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <MilestoneModal
            milestone={
              selectedMilestone ?? undefined
            }
            onClose={() =>
              setShowModal(false)
            }
            onSaved={async () => {
              const {
                data: { user },
              } = await supabase.auth.getUser();

              if (user) {
                await checkAchievements(
                  user.id
                );
              }

              await loadMilestones();

              setShowModal(false);
            }}
          />
        )}
      </div>
    </main>
  );
}