"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import RewardModal from "@/components/rewards/RewardModal";


export default function RewardsPage() {

  const [showModal, setShowModal] = useState(false);


  return (
    <main className="min-h-screen bg-zinc-950 pb-24 text-white">

      <div className="mx-auto max-w-md px-6 py-8">


        <h1 className="text-4xl font-bold">
          🎁 Rewards
        </h1>


        <p className="mt-2 text-zinc-500">
          Create rewards to motivate your journey.
        </p>



        <button
          onClick={() => setShowModal(true)}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 p-4 font-semibold text-black transition hover:bg-emerald-400"
        >

          <Plus size={20} />

          Add Reward

        </button>



        <div className="mt-6 rounded-3xl bg-zinc-900 p-8 text-center">


          <p className="text-zinc-400">
            No rewards yet.
          </p>


          <p className="mt-2 text-sm text-zinc-500">
            Create rewards that you can unlock as you progress.
          </p>


        </div>



        {showModal && (

          <RewardModal

            onClose={() =>
              setShowModal(false)
            }

            onSaved={() =>
              setShowModal(false)
            }

          />

        )}


      </div>

    </main>
  );
}