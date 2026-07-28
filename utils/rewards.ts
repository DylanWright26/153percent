import { supabase } from "@/lib/supabase";


export async function checkRewards(
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

    console.error(
      "Reward unlock error:",
      error
    );

    return;

  }


  console.log(
    "Rewards checked"
  );

}