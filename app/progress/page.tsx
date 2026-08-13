"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

import {
  getLevel,
  getLevelProgress,
  getXPForCurrentLevel,
  getXPNeededForNextLevel,
} from "@/utils/levels";

export default function ProgressPage() {
  const { profile } = useApp();

  const xp = profile?.total_xp ?? 0;

  const level = getLevel(xp);

  const currentXP = getXPForCurrentLevel(xp);

  const nextLevelXP = getXPNeededForNextLevel(xp);

  const progress = getLevelProgress(xp);

  const streak = profile?.current_streak ?? 0;

  const longestStreak = profile?.longest_streak ?? 0;

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 text-white">

      <div className="mx-auto max-w-md px-6 py-8">

        <h1 className="text-4xl font-bold">
          ⭐ Progress
        </h1>

        <p className="mt-2 text-zinc-500">
          Your journey so far.
        </p>

        {/* Level */}

        <div className="mt-8 rounded-3xl bg-zinc-900 p-6">

          <p className="text-sm uppercase tracking-wider text-zinc-500">
            ⭐ Level
          </p>

          <h2 className="mt-3 text-4xl font-black">
            {level}
          </h2>

          <p className="mt-2 text-zinc-400">
            {xp} XP Earned
          </p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-800">

            <div
              className="h-full rounded-full bg-emerald-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <p className="mt-2 text-sm text-zinc-500">
            {currentXP} / {nextLevelXP}
          </p>

        </div>

        {/* All Levels */}

        <Link
          href="/levels"
          className="mt-4 block rounded-2xl bg-zinc-900 p-5 text-center transition hover:bg-zinc-800"
        >

          <p className="text-lg font-bold">
            ⭐ View All Levels
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            See the complete XP progression
          </p>

        </Link>

        {/* Streak */}

        <div className="mt-5 rounded-3xl bg-zinc-900 p-6">

          <p className="text-sm uppercase tracking-wider text-zinc-500">
            🔥 Streak
          </p>

          <div className="mt-4 flex justify-between">

            <div>

              <p className="text-zinc-400">
                Current
              </p>

              <p className="text-3xl font-bold">
                {streak}
              </p>

            </div>

            <div className="text-right">

              <p className="text-zinc-400">
                Best
              </p>

              <p className="text-3xl font-bold">
                {longestStreak}
              </p>

            </div>

          </div>

        </div>

        {/* Achievements */}

        <Link
          href="/achievements"
          className="mt-5 block rounded-3xl bg-zinc-900 p-6 transition hover:bg-zinc-800"
        >

          <p className="text-sm uppercase tracking-wider text-zinc-500">
            🏆 Achievements
          </p>

          <p className="mt-3 text-3xl font-bold">
            View Achievements
          </p>

          <p className="mt-2 text-zinc-400">
            Unlock achievements as you progress.
          </p>

        </Link>

        {/* Rewards */}

        <Link
          href="/rewards"
          className="mt-5 block rounded-3xl bg-zinc-900 p-6 transition hover:bg-zinc-800"
        >

          <p className="text-sm uppercase tracking-wider text-zinc-500">
            🎁 Rewards
          </p>

          <p className="mt-3 text-3xl font-bold">
            View Rewards
          </p>

          <p className="mt-2 text-zinc-400">
            Unlock rewards by completing goals.
          </p>

        </Link>

        {/* Statistics */}

        <Link
          href="/stats"
          className="mt-5 block rounded-3xl bg-zinc-900 p-6 transition hover:bg-zinc-800"
        >

          <p className="text-sm uppercase tracking-wider text-zinc-500">
            📊 Statistics
          </p>

          <p className="mt-3 text-3xl font-bold">
            View Stats
          </p>

          <p className="mt-2 text-zinc-400">
            Track your personal stats and records.
          </p>

        </Link>

      </div>

    </main>
  );
}