"use client";

import { useState } from "react";

import {
  getXPNeededForLevel,
  getXPNeededForNextLevel,
  getLevelProgress,
} from "@/utils/levels";

interface StatsGridProps {
  xp: number;
  level: number;
  streak: number;
}

export default function StatsGrid({
  xp,
  level,
  streak,
}: StatsGridProps) {
  const [expanded, setExpanded] = useState(false);

  const progress = getLevelProgress(xp);

  return (
    <div className="mt-6 space-y-4">

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-2xl bg-zinc-900 p-5 text-center">
          <p className="text-3xl">⭐</p>

          <h3 className="mt-2 text-2xl font-bold">
            {xp}
          </h3>

          <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
            XP
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-900 p-5 text-center">
          <p className="text-3xl">🔥</p>

          <h3 className="mt-2 text-2xl font-bold">
            {streak}
          </h3>

          <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
            Streak
          </p>
        </div>

      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full rounded-2xl bg-zinc-900 p-5 text-left transition hover:bg-zinc-800"
      >
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm uppercase tracking-wider text-zinc-500">
              🏆 Level
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {level}
            </h2>
          </div>

          <span className="text-2xl">
            {expanded ? "▲" : "▼"}
          </span>

        </div>

        {expanded && (
          <div className="mt-6 border-t border-zinc-800 pt-5">

            <p className="text-zinc-400">
              {xp} XP Earned
            </p>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <div className="mt-6 space-y-3">

              {[1, 2, 3].map((offset) => {
                const targetLevel = level + offset;
                const requiredXP =
                  getXPNeededForLevel(targetLevel);

                const remaining =
                  Math.max(requiredXP - xp, 0);

                return (
                  <div
                    key={targetLevel}
                    className="flex items-center justify-between rounded-xl bg-zinc-800 p-3"
                  >
                    <div>
                      <p className="font-semibold">
                        Level {targetLevel}
                      </p>

                      <p className="text-sm text-zinc-500">
                        {requiredXP} XP
                      </p>
                    </div>

                    <p className="font-medium text-emerald-400">
                      {remaining} XP to go
                    </p>
                  </div>
                );
              })}

            </div>

          </div>
        )}
      </button>

    </div>
  );
}