import { supabase } from "@/lib/supabase";
import { getLevel } from "@/utils/levels";

export async function checkRewards(userId: string) {
  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("total_xp, current_streak")
    .eq("user_id", userId)
    .single();

  if (profileError || !profile) {
    console.error("Profile error:", profileError);
    return;
  }

  const level = getLevel(profile.total_xp);

  console.log("========== REWARD CHECK ==========");
  console.log("User:", userId);
  console.log("XP:", profile.total_xp);
  console.log("Calculated Level:", level);
  console.log("Current Streak:", profile.current_streak);

  // Get rewards
  const { data: rewards, error: rewardsError } = await supabase
    .from("rewards")
    .select("*")
    .eq("user_id", userId);

  if (rewardsError || !rewards) {
    console.error("Rewards error:", rewardsError);
    return;
  }

  console.log("Rewards found:", rewards.length);

  for (const reward of rewards) {
    console.log("------------------------");
    console.log("Reward:", reward.name);
    console.log("Type:", reward.unlock_type);
    console.log("Requirement:", reward.unlock_value);
    console.log("Already unlocked:", reward.unlocked);

    if (reward.unlocked) {
      console.log("Skipping - already unlocked");
      continue;
    }

    let shouldUnlock = false;

    switch (reward.unlock_type) {
      case "level":
        shouldUnlock = level >= reward.unlock_value;
        break;

      case "streak":
        shouldUnlock =
          profile.current_streak >= reward.unlock_value;
        break;
    }

    console.log("Should unlock:", shouldUnlock);

    if (shouldUnlock) {
      console.log(">>> Unlocking reward:", reward.name);

      const { error } = await supabase
        .from("rewards")
        .update({
          unlocked: true,
        })
        .eq("id", reward.id);

      if (error) {
        console.error("Unlock error:", error);
      } else {
        console.log("Reward unlocked successfully!");
      }
    }
  }

  console.log("========== END CHECK ==========");
}

export async function checkMissionRewards(
  userId: string,
  missionId: string
) {
  const { error } = await supabase
    .from("rewards")
    .update({
      unlocked: true,
    })
    .eq("user_id", userId)
    .eq("unlock_type", "mission")
    .eq("unlock_id", missionId);

  if (error) {
    console.error("Mission reward error:", error);
  } else {
    console.log("Mission rewards checked");
  }
}