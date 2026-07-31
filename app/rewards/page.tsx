"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import RewardModal, {
  Reward,
} from "@/components/rewards/RewardModal";

const unlockTypes = [
  "All",
  "level",
  "mission",
  "milestone",
  "achievement",
  "streak",
  "personal_best",
];

export default function RewardsPage() {

  const [rewards, setRewards] =
    useState<Reward[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [selectedReward, setSelectedReward] =
    useState<Reward | null>(null);

  const [selectedView, setSelectedView] =
    useState<
      "available" |
      "locked" |
      "claimed"
    >("available");

  const [selectedUnlockType, setSelectedUnlockType] =
    useState("All");

  useEffect(() => {
    loadRewards();
  }, []);
  async function loadRewards() {

  setLoading(true);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(error);
    setLoading(false);
    return;
  }

  const rewardsWithNames = await Promise.all(

    (data ?? []).map(async (reward) => {

      if (!reward.unlock_id) {
        return reward;
      }

      let unlockName = null;

      switch (reward.unlock_type) {

        case "mission": {

          const { data } = await supabase
            .from("missions")
            .select("name")
            .eq("id", reward.unlock_id)
            .single();

          unlockName = data?.name;
          break;
        }

        case "milestone": {

          const { data } = await supabase
            .from("milestones")
            .select("title")
            .eq("id", reward.unlock_id)
            .single();

          unlockName = data?.title;
          break;
        }

        case "achievement": {

          const { data } = await supabase
            .from("achievements")
            .select("name")
            .eq("id", reward.unlock_id)
            .single();

          unlockName = data?.name;
          break;
        }

        case "personal_best": {

          const { data } = await supabase
            .from("personal_bests")
            .select("name")
            .eq("id", reward.unlock_id)
            .single();

          unlockName = data?.name;
          break;
        }

      }

      return {
        ...reward,
        unlock_name:
          unlockName ?? "Unknown goal",
      };

    })

  );

  setRewards(rewardsWithNames);

  setLoading(false);

}
function openCreateModal() {
  setSelectedReward(null);
  setShowModal(true);
}

function openEditModal(
  reward: Reward
) {
  setSelectedReward(reward);
  setShowModal(true);
}

async function deleteReward(id: string) {

  console.log("Deleting reward:", id);

  const confirmed = window.confirm(
    "Are you sure you want to delete this reward?"
  );

  if (!confirmed) return;

  const { data, error } = await supabase
    .from("rewards")
    .delete()
    .eq("id", id)
    .select();

  console.log("Deleted rows:", data);

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  await loadRewards();

}

async function claimReward(
  reward: Reward
) {

  const { error } = await supabase
    .from("rewards")
    .update({
      claimed: true,
      claimed_at: new Date(),
    })
    .eq("id", reward.id);

  if (error) {
    alert(error.message);
    return;
  }

  await loadRewards();

}

function getUnlockText(
  reward: Reward
) {

  if (reward.unlock_type === "level") {
    return `Level ${reward.unlock_value}`;
  }

  if (reward.unlock_type === "streak") {
    return `${reward.unlock_value} Day Streak`;
  }

  return reward.unlock_name ?? "Unknown";

}

const filteredRewards = useMemo(() => {

  return rewards.filter((reward) => {

    if (
      selectedUnlockType !== "All" &&
      reward.unlock_type !== selectedUnlockType
    ) {
      return false;
    }

    switch (selectedView) {

      case "available":
        return reward.unlocked && !reward.claimed;

      case "locked":
        return !reward.unlocked;

      case "claimed":
        return reward.claimed;

      default:
        return true;

    }

  });

}, [
  rewards,
  selectedView,
  selectedUnlockType,
]);
return (
  <main className="min-h-screen bg-zinc-950 pb-24 text-white">

    <div className="mx-auto max-w-md px-6 py-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            🎁 Rewards
          </h1>

          <p className="mt-2 text-zinc-500">
            Earn rewards by improving every day.
          </p>

        </div>

        <button
          onClick={openCreateModal}
          className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-black hover:bg-green-500"
        >
          + Add
        </button>

      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">

        <button
          onClick={() => setSelectedView("available")}
          className={`rounded-xl py-2 font-semibold ${
            selectedView === "available"
              ? "bg-green-600 text-black"
              : "bg-zinc-800"
          }`}
        >
          Available
        </button>

        <button
          onClick={() => setSelectedView("locked")}
          className={`rounded-xl py-2 font-semibold ${
            selectedView === "locked"
              ? "bg-yellow-500 text-black"
              : "bg-zinc-800"
          }`}
        >
          Locked
        </button>

        <button
          onClick={() => setSelectedView("claimed")}
          className={`rounded-xl py-2 font-semibold ${
            selectedView === "claimed"
              ? "bg-blue-600"
              : "bg-zinc-800"
          }`}
        >
          Claimed
        </button>

      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">

        {unlockTypes.map((type) => (

          <button
            key={type}
            onClick={() =>
              setSelectedUnlockType(type)
            }
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
              selectedUnlockType === type
                ? "bg-green-600 text-black"
                : "bg-zinc-800"
            }`}
          >
            {type === "All"
              ? "All"
              : type
                  .replace("_", " ")
                  .replace(/\b\w/g, (c) =>
                    c.toUpperCase()
                  )}
          </button>

        ))}

      </div>

      {loading ? (

        <div className="mt-8 text-zinc-500">
          Loading...
        </div>

      ) : filteredRewards.length === 0 ? (

        <div className="mt-8 rounded-3xl bg-zinc-900 p-6">

          <h2 className="text-xl font-semibold">
            No rewards found
          </h2>

        </div>

      ) : (

        <div className="mt-8 space-y-4">

          {filteredRewards.map((reward) => (

            <div
              key={reward.id}
              className="rounded-3xl bg-zinc-900 p-5"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-bold">
                    {reward.name}
                  </h2>

                  {reward.category && (

                    <span className="mt-2 inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs text-green-400">

                      {reward.category}

                    </span>

                  )}

                </div>

              </div>

              {reward.description && (

                <p className="mt-3 text-zinc-400">

                  {reward.description}

                </p>

              )}

              <p className="mt-4 text-sm text-zinc-500">

                Unlock by:

                <span className="ml-2 text-white">

                  {getUnlockText(reward)}

                </span>

              </p>

              <div className="mt-5 flex items-center justify-between">

                <div>

                  {reward.claimed ? (

                    <span className="text-green-400">

                      ✅ Claimed

                    </span>

                  ) : reward.unlocked ? (

                    <button
                      onClick={() =>
                        claimReward(reward)
                      }
                      className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-black"
                    >
                      Claim
                    </button>

                  ) : (

                    <span className="text-zinc-500">

                      🔒 Locked

                    </span>

                  )}

                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      openEditModal(reward)
                    }
                    className="rounded-xl bg-zinc-800 p-2 hover:bg-zinc-700"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() =>
                      deleteReward(reward.id)
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

        <RewardModal
          reward={
            selectedReward ?? undefined
          }
          onClose={() =>
            setShowModal(false)
          }
          onSaved={async () => {

            await loadRewards();

            setShowModal(false);

          }}
        />

      )}

    </div>

  </main>
);
}