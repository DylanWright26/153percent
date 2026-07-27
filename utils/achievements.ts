import { supabase } from "@/lib/supabase";
import { achievements } from "@/lib/achievements";
import { getLevel } from "@/utils/levels";


async function unlockAchievement(
  userId: string,
  unlockedIds: Set<string>,
  achievementId: string
) {

  if (unlockedIds.has(achievementId)) {
    return;
  }


  const achievement = achievements.find(
    (a) => a.id === achievementId
  );


  if (!achievement) {
    return;
  }


  const { error } = await supabase
    .from("user_achievements")
    .insert({
      user_id: userId,
      achievement_id: achievement.id,
    });


  if (!error) {
    unlockedIds.add(achievementId);
  }

}



export async function checkAchievements(
  userId: string
) {


  // =========================
  // Get unlocked achievements
  // =========================

  const { data: unlocked } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);


  const unlockedIds = new Set(
    unlocked?.map(
      (a) => a.achievement_id
    ) ?? []
  );



  // =========================
  // Get missions
  // =========================

  const { data: missions } = await supabase
    .from("missions")
    .select("progress, target")
    .eq("user_id", userId);



  // =========================
  // Get milestones
  // =========================

  const { data: milestones } = await supabase
    .from("milestones")
    .select("completed")
    .eq("user_id", userId);



  // =========================
  // Get profile
  // =========================

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "total_xp, current_streak, missions_completed"
    )
    .eq("user_id", userId)
    .single();



  const completedMission =
    missions?.some(
      (mission) =>
        mission.progress >= mission.target
    ) ?? false;



  const level = getLevel(
    profile?.total_xp ?? 0
  );


  const streak =
    profile?.current_streak ?? 0;


  const missionsCompleted =
    profile?.missions_completed ?? 0;


  const milestonesCompleted =
    milestones?.filter(
      (milestone) =>
        milestone.completed
    ).length ?? 0;



  // =========================
  // 🌟 Firsts
  // =========================

  if (completedMission) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "first_mission"
    );

  }


  if (milestonesCompleted >= 1) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "first_milestone"
    );

  }


  if (level >= 2) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "first_level_up"
    );

  }


  if (streak >= 2) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "first_streak"
    );

  }
    // =========================
  // ⭐ Levels
  // =========================


  if (level >= 5) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "level_5"
    );

  }


  if (level >= 10) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "level_10"
    );

  }


  if (level >= 20) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "level_20"
    );

  }


  if (level >= 35) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "level_35"
    );

  }


  if (level >= 50) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "level_50"
    );

  }




  // =========================
  // 🔥 Streaks
  // =========================


  if (streak >= 7) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "streak_7"
    );

  }


  if (streak >= 30) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "streak_30"
    );

  }


  if (streak >= 100) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "streak_100"
    );

  }


  if (streak >= 365) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "streak_365"
    );

  }




  // =========================
  // 🎯 Missions
  // =========================


  if (missionsCompleted >= 10) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "missions_10"
    );

  }


  if (missionsCompleted >= 50) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "missions_50"
    );

  }


  if (missionsCompleted >= 100) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "missions_100"
    );

  }


  if (missionsCompleted >= 250) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "missions_250"
    );

  }


  if (missionsCompleted >= 500) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "missions_500"
    );

  }


  if (missionsCompleted >= 1000) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "missions_1000"
    );

  }




  // =========================
  // 🏁 Milestones
  // =========================


  if (milestonesCompleted >= 5) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "milestones_5"
    );

  }


  if (milestonesCompleted >= 10) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "milestones_10"
    );

  }


  if (milestonesCompleted >= 25) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "milestones_25"
    );

  }


  if (milestonesCompleted >= 50) {

    await unlockAchievement(
      userId,
      unlockedIds,
      "milestones_50"
    );

  }

}