"use client";

import { useState } from "react";
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
  "XP",
  "Level",
  "Streak",
  "Missions Completed",
  "Milestones Completed",
  "Personal Bests",
];


type Props = {
  onClose: () => void;
  onSaved: () => void;
};


export default function RewardModal({
  onClose,
  onSaved,
}: Props) {


  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Lifestyle");

  const [unlockType, setUnlockType] = useState("XP");

  const [unlockValue, setUnlockValue] = useState(1000);



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


  const { error } = await supabase
    .from("rewards")
    .insert({
      user_id: user.id,
      name,
      description,
      category,
      unlock_type: unlockType,
      unlock_value: unlockValue,
      unlocked: false,
      claimed: false,
    });


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
          🎁 Create Reward
        </h2>


        <p className="mt-2 text-sm text-zinc-400">
          Create rewards to unlock as you progress.
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

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>




          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              Unlock Requirement
            </label>


            <select
              value={unlockType}
              onChange={(e) =>
                setUnlockType(e.target.value)
              }
              className="w-full rounded-xl bg-zinc-800 p-3 outline-none"
            >

              {unlockTypes.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>




          <div>

            <label className="mb-2 block text-sm text-zinc-300">
              Requirement Value
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


            <p className="mt-2 text-xs text-zinc-500">
              Example: 5000 XP, Level 10, 30 day streak.
            </p>

          </div>


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
            Create Reward
          </button>


        </div>


      </div>


    </div>
  );
}