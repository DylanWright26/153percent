"use client";

import Link from "next/link";

import { useApp } from "@/context/AppContext";
import {
  getLevel,
  getXPNeededForLevel,
} from "@/utils/levels";

const MAX_LEVEL = 50;

export default function LevelsPage() {
  const { profile } = useApp();

  const xp = profile?.total_xp ?? 0;
  const currentLevel = getLevel(xp);

  const levels = Array.from(
    { length: MAX_LEVEL },
    (_, index) => index + 1
  );

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 text-white">

      <div className="mx-auto max-w-md px-6 py-8">

        <Link
          href="/progress"
          className="text-lg text-zinc-400 transition hover:text-white"
        >
          ← Back
        </Link>

        <div className="mt-8">

          <h1 className="text-4xl font-black">
            ⭐ Levels
          </h1>

          <p className="mt-2 text-zinc-500">
            Your complete XP progression.
          </p>

        </div>

        {/* Current level */}

        <div className="mt-8 rounded-3xl bg-zinc-900 p-6">

          <p className="text-sm uppercase tracking-wider text-zinc-500">
            Current Level
          </p>

          <div className="mt-3 flex items-end justify-between">

            <h2 className="text-5xl font-black">
              {currentLevel}
            </h2>

            <div className="text-right">

              <p className="text-2xl font-bold">
                {xp.toLocaleString()}
              </p>

              <p className="text-sm text-zinc-500">
                Total XP
              </p>

            </div>

          </div>

        </div>

        {/* Level progression */}

        <div className="mt-6 space-y-3">

          {levels.map((level) => {

            const requiredXP =
              getXPNeededForLevel(level);

            const isCurrent =
              level === currentLevel;

            const isCompleted =
              level < currentLevel;

            const isLocked =
              level > currentLevel;

            const remaining =
              Math.max(
                requiredXP - xp,
                0
              );

            return (

              <div
                key={level}
                className={`
                  rounded-2xl p-5
                  ${
                    isCurrent
                      ? "bg-emerald-500 text-black"
                      : isCompleted
                      ? "bg-zinc-900"
                      : "bg-zinc-900/70"
                  }
                `}
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    <div
                      className={`
                        flex h-12 w-12 shrink-0
                        items-center justify-center
                        rounded-full text-lg font-black
                        ${
                          isCurrent
                            ? "bg-black/20"
                            : "bg-zinc-800"
                        }
                      `}
                    >
                      {isCompleted
                        ? "✓"
                        : isCurrent
                        ? "⭐"
                        : "🔒"}
                    </div>

                    <div>

                      <p
                        className={`
                          text-lg font-bold
                          ${
                            isCurrent
                              ? "text-black"
                              : "text-white"
                          }
                        `}
                      >
                        Level {level}
                      </p>

                      <p
                        className={`
                          text-sm
                          ${
                            isCurrent
                              ? "text-black/60"
                              : "text-zinc-500"
                          }
                        `}
                      >
                        {requiredXP.toLocaleString()} XP required
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    {isCompleted && (
                      <p className="font-semibold text-emerald-400">
                        Complete
                      </p>
                    )}

                    {isCurrent && (
                      <p className="font-bold text-black">
                        Current
                      </p>
                    )}

                    {isLocked && (
                      <p className="text-sm text-zinc-500">
                        {remaining.toLocaleString()} XP
                      </p>
                    )}

                  </div>

                </div>

              </div>

            );
          })}

        </div>

      </div>

    </main>
  );
}