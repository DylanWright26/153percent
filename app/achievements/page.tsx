"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import { achievements } from "@/lib/achievements";
import { supabase } from "@/lib/supabase";


export default function AchievementsPage() {

  const [unlocked, setUnlocked] = useState<Set<string>>(
    new Set()
  );
  const [selectedAchievement, setSelectedAchievement] =
  useState<(typeof achievements)[number] | null>(null);

  useEffect(() => {
    loadAchievements();
  }, []);



  async function loadAchievements() {

    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) {
      return;
    }


    const { data, error } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user.id);


    if (error) {
      console.error(error);
      return;
    }


    setUnlocked(
      new Set(
        data.map(
          (achievement) =>
            achievement.achievement_id
        )
      )
    );

  }



  const categories = [
    "firsts",
    "levels",
    "missions",
    "streaks",
    "milestones",
    "pbs",
  ];


  const unlockedCount = unlocked.size;



  return (

    <main className="min-h-screen bg-zinc-950 pb-24 text-white">

      <div className="mx-auto max-w-md px-6 py-8">


        <Link
        href="/progress"
        className="mb-6 inline-flex items-center text-sm text-zinc-400 hover:text-white"
        >
          ← Back
          </Link>

<h1 className="text-4xl font-bold">
  🏆 Achievements
</h1>


        <p className="mt-2 text-zinc-500">
          Track every accomplishment on your 153% journey.
        </p>



        <div className="mt-6 rounded-3xl bg-zinc-900 p-5">

          <p className="text-sm text-zinc-400">
            Progress
          </p>


          <p className="mt-1 text-3xl font-bold">
            {unlockedCount} / {achievements.length}
          </p>


          <p className="mt-1 text-zinc-500">
            Achievements unlocked
          </p>

        </div>
                <div className="mt-8 space-y-8">

          {categories.map((category) => {

            const categoryAchievements =
              achievements.filter(
                (achievement) =>
                  achievement.category === category
              );


            if (categoryAchievements.length === 0) {
              return null;
            }


            return (

              <section key={category}>

                <h2 className="mb-4 text-xl font-bold capitalize">
                  {category}
                </h2>


                <div className="space-y-4">

                  {categoryAchievements.map((achievement) => {

                    const isUnlocked =
                      unlocked.has(
                        achievement.id
                      );


                    return (
                      <div
                        key={achievement.id}
                        onClick={() => setSelectedAchievement(achievement)}
                        className={`cursor-pointer rounded-3xl p-5 transition hover:bg-zinc-800 ${
                          isUnlocked
                            ? "bg-zinc-900"
                            : "bg-zinc-900 opacity-50"
                        }`}
                      >

                        <div className="flex items-start gap-4">


                          <div className="text-3xl">
                            {isUnlocked
                              ? achievement.icon
                              : "🔒"}
                          </div>



                          <div className="flex-1">

                            <h3 className="text-lg font-bold">
                              {achievement.name}
                            </h3>


                            <p className="mt-1 text-zinc-400">
                              {achievement.description}
                            </p>


                            <div className="mt-3">

                              {isUnlocked ? (

                                <span className="rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold text-green-400">
                                  ✅ Unlocked
                                </span>

                              ) : (

                                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-500">
                                  🔒 Locked
                                </span>

                              )}

                            </div>

                          </div>


                        </div>


                      </div>

                    );

                  })}

                </div>


              </section>

            );

          })}

        </div>


      </div>

    </main>

  );
}