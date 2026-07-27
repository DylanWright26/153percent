"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { useApp, Mission } from "@/context/AppContext";
import MissionModal from "@/components/missions/MissionModal";

export default function MissionsPage() {
  const {
    missions,
    loading,
    deleteMission,
    refreshMissions,
    refreshProfile,
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);


  function openCreateModal() {
    setSelectedMission(null);
    setShowModal(true);
  }


  function openEditModal(mission: Mission) {
    setSelectedMission(mission);
    setShowModal(true);
  }


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <p className="text-lg text-zinc-400">
          Loading missions...
        </p>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-zinc-950 pb-24 text-white">

      <div className="mx-auto max-w-md px-6 py-8">

        <h1 className="text-4xl font-bold">
          🎯 Missions
        </h1>

        <p className="mt-2 text-zinc-500">
          Manage your missions.
        </p>


        <button
          onClick={openCreateModal}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 p-4 font-semibold text-black transition hover:bg-emerald-400"
        >
          <Plus size={20} />
          Add Mission
        </button>


        <div className="mt-6 space-y-4">


          {missions.length === 0 && (
            <div className="rounded-2xl bg-zinc-900 p-8 text-center">

              <p className="text-zinc-400">
                No missions yet.
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Create your first mission to begin your journey.
              </p>

            </div>
          )}



          {missions.map((mission) => (

            <div
              key={mission.id}
              className="rounded-2xl bg-zinc-900 p-5"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-lg font-semibold">
                    {mission.name}
                  </h2>


                  {mission.description && (
                    <p className="mt-2 text-sm text-zinc-400">
                      {mission.description}
                    </p>
                  )}


                  <p className="mt-2 text-sm text-zinc-500">
                    {mission.category}
                  </p>

                </div>


                <span className="rounded-full bg-emerald-500 px-3 py-1 text-sm font-bold text-black">
                  +{mission.xp} XP
                </span>


              </div>



              <div className="mt-5">

                <div className="mb-2 flex justify-between text-sm text-zinc-400">

                  <span>
                    {mission.frequency}
                  </span>


                  <span>
                    {mission.progress} / {mission.target} {mission.unit}
                  </span>

                </div>



                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">

                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${Math.min(
                        (mission.progress / mission.target) * 100,
                        100
                      )}%`,
                    }}
                  />

                </div>


              </div>



              <div className="mt-5 flex items-center justify-between">


                <span className="text-sm text-zinc-400">
                  {mission.required_for_streak
                    ? "🔥 Maintain Daily Streak"
                    : "⭐ Optional Mission"}
                </span>


                <div className="flex gap-3">


                  <button
                    onClick={() => openEditModal(mission)}
                    className="rounded-xl bg-zinc-800 p-2 transition hover:bg-zinc-700"
                  >
                    <Pencil size={18} />
                  </button>



                  <button
                    onClick={() => deleteMission(mission.id)}
                    className="rounded-xl bg-red-500/20 p-2 text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={18} />
                  </button>


                </div>


              </div>


            </div>

          ))}


        </div>


      </div>



      {showModal && (

        <MissionModal
          mission={selectedMission ?? undefined}
          onClose={() => setShowModal(false)}
          onSaved={async () => {
            await refreshMissions();
            await refreshProfile();
            setShowModal(false);
          }}
        />

      )}


    </main>
  );
}