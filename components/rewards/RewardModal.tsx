"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


const categories = [
  "Lifestyle",
  "Fitness",
  "Football",
  "Gaming",
  "Money",
  "Personal",
  "Other",
];


const unlockTypes = [
  "Level",
  "Streak",
  "Mission",
  "Milestone",
  "Achievement",
  "Personal Best",
];


export interface Reward {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  unlock_type: string;
  unlock_id: string | null;
  unlock_value: number;
  unlocked: boolean;
  claimed: boolean;
  claimed_at: string | null;
  unlock_name?: string;
}

type Props = {
  onClose: () => void;
  onSaved: () => void;
  reward?: Reward;
};


export default function RewardModal({
  onClose,
  onSaved,
  reward,
}: Props) {


const [name, setName] = useState(
  reward?.name ?? ""
);

const [description, setDescription] = useState(
  reward?.description ?? ""
);

const [category, setCategory] = useState(
  reward?.category ?? "Lifestyle"
);

const [unlockType, setUnlockType] = useState(
  reward
    ? reward.unlock_type
        .replace("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Level"
);

const [unlockId, setUnlockId] = useState(
  reward?.unlock_id ?? ""
);

const [unlockValue, setUnlockValue] = useState(
  reward?.unlock_value ?? 1
);

  const [options, setOptions] = useState<any[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(false);



  async function loadUnlockOptions(type: string) {

    setOptions([]);

    setUnlockId("");

    setLoadingOptions(true);


    if (type === "Mission") {

      const { data } = await supabase
        .from("missions")
        .select("id, name");

      setOptions(data ?? []);

    }


    if (type === "Milestone") {

      const { data } = await supabase
        .from("milestones")
        .select("id, title");

      setOptions(data ?? []);

    }


    if (type === "Achievement") {

      const { data } = await supabase
        .from("achievements")
        .select("id, name");

      setOptions(data ?? []);

    }


    if (type === "Personal Best") {

      const { data } = await supabase
        .from("personal_bests")
        .select("id, name");

      setOptions(data ?? []);

    }


    setLoadingOptions(false);

  }





  useEffect(() => {

    if (
      unlockType === "Mission" ||
      unlockType === "Milestone" ||
      unlockType === "Achievement" ||
      unlockType === "Personal Best"
    ) {

      loadUnlockOptions(unlockType);

    } else {

      setOptions([]);

      setUnlockId("");

    }

  }, [unlockType]);






async function saveReward() {

  if (!name.trim()) {
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const rewardData = {
    name,
    description,
    category,
    unlock_type: unlockType
      .toLowerCase()
      .replace(" ", "_"),
    unlock_id: unlockId || null,
    unlock_value: unlockValue,
  };

  let error;

  if (reward) {

    const result = await supabase
      .from("rewards")
      .update(rewardData)
      .eq("id", reward.id);

    error = result.error;

  } else {

    const result = await supabase
      .from("rewards")
      .insert({
        user_id: user.id,
        ...rewardData,
        unlocked: false,
        claimed: false,
      });

    error = result.error;

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
{reward ? "✏️ Edit Reward" : "🎁 Create Reward"}
        </h2>


        <p className="mt-2 text-sm text-zinc-400">
{reward
  ? "Update your reward."
  : "Create rewards to unlock as you progress."}
          </p>




        <div className="mt-6 space-y-5">


          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Reward Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. New Football Boots"
              className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
            />
          </div>




          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Why does this reward matter?"
              className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
            />
          </div>





          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
            >

              {categories.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}

            </select>
          </div>





          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Unlock Type
            </label>

            <select
              value={unlockType}
              onChange={(e) =>
                setUnlockType(e.target.value)
              }
              className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
            >

              {unlockTypes.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}

            </select>
          </div>





          {(unlockType === "Mission" ||
            unlockType === "Milestone" ||
            unlockType === "Achievement" ||
            unlockType === "Personal Best") && (

            <div>

              <label className="mb-2 block text-sm text-zinc-300">
                Choose {unlockType}
              </label>


              <select
                value={unlockId}
                onChange={(e) =>
                  setUnlockId(e.target.value)
                }
                className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
              >

                <option value="">
                  {loadingOptions
                    ? "Loading..."
                    : `Select ${unlockType}`}
                </option>


                {options.map((item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >

                    {item.name ?? item.title}

                  </option>

                ))}


              </select>

            </div>

          )}






          {(unlockType === "Level" ||
            unlockType === "Streak") && (

            <div>

              <label className="mb-2 block text-sm text-zinc-300">
                Requirement
              </label>


              <input
                type="number"
                min={1}
                value={unlockValue}
                onChange={(e) =>
                  setUnlockValue(
                    Number(e.target.value)
                  )
                }
                className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
              />

            </div>

          )}






        </div>





        <div className="mt-8 flex gap-3">


          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-zinc-800 py-3 font-medium hover:bg-zinc-700"
          >
            Cancel
          </button>



          <button
            onClick={saveReward}
            className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400"
          >
            {reward ? "Save Changes" : "Create Reward"}
          </button>


        </div>


      </div>


    </div>

  );

}