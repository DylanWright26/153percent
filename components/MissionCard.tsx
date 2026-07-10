"use client";

import { Minus, Plus } from "lucide-react";

export interface Mission {
  id: string;
  name: string;
  category: string;
  frequency: string;
  target: number;
  progress: number;
  unit: string;
  xp: number;
  completion_bonus: number;
  required_for_streak: boolean;
  active: boolean;
}

interface MissionCardProps {
  mission: Mission;
  onUpdate: (
    mission: Mission,
    change: number
  ) => void;
}

export default function MissionCard({
  mission,
  onUpdate,
}: MissionCardProps) {
  const percent = Math.min(
    (mission.progress / mission.target) * 100,
    100
  );

  return (
    <div className="w-full rounded-2xl bg-zinc-900 p-5">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-lg font-bold">
            {mission.name}
          </h3>

          <p className="text-sm text-zinc-400">
            {mission.category}
          </p>
        </div>

        <div className="rounded-xl bg-emerald-500 px-3 py-1 font-bold text-black">
          {mission.xp} XP
        </div>

      </div>

      <div className="mt-4">

        <div className="mb-3 flex items-center justify-between">

          <button
            onClick={() => onUpdate(mission, -1)}
            disabled={mission.progress === 0}
            className="rounded-xl bg-zinc-800 p-2 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus size={18} />
          </button>

          <div className="text-center">

            <p className="capitalize text-sm text-zinc-400">
              {mission.frequency}
            </p>

            <p className="font-semibold">
              {mission.progress} / {mission.target} {mission.unit}
            </p>

          </div>

          <button
            onClick={() => onUpdate(mission, 1)}
            disabled={mission.progress === mission.target}
            className="rounded-xl bg-emerald-500 p-2 text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={18} />
          </button>

        </div>

        <div className="h-2 rounded-full bg-zinc-800">

          <div
            className="h-2 rounded-full bg-emerald-500 transition-all duration-300"
            style={{
              width: `${percent}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}