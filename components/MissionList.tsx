"use client";

import MissionCard, { Mission } from "./MissionCard";
import { useApp } from "@/context/AppContext";

interface MissionListProps {
  missions: Mission[];
}

export default function MissionList({
  missions,
}: MissionListProps) {
  const { updateMissionProgress } = useApp();

  return (
    <div className="mt-8 rounded-3xl bg-zinc-900 p-6">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Your Missions
          </h2>

          <p className="mt-1 text-zinc-500">
            {missions.length} mission{missions.length === 1 ? "" : "s"}
          </p>
        </div>

      </div>

      <div className="mt-6 space-y-4">

        {missions.length === 0 ? (
          <div className="rounded-2xl bg-zinc-800 p-6 text-center text-zinc-400">
            No missions yet.
            <br />
            Create your first mission to begin your journey.
          </div>
        ) : (
          missions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onUpdate={updateMissionProgress}
            />
          ))
        )}

      </div>

    </div>
  );
}