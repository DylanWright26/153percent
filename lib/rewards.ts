import { supabase } from "@/lib/supabase";


export async function checkRewards(
  userId: string,
  type: string,
  id?: string
) {


  const { data: rewards, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("user_id", userId)
    .eq("unlocked", false);



  if (error || !rewards) {
    return;
  }



  for (const reward of rewards) {


    let unlocked = false;



    // Specific goals
    if (
      reward.unlock_type === type &&
      reward.unlock_id === id
    ) {

      unlocked = true;

    }



    // Level / streak style rewards
    // added later when we connect profile data



    if (unlocked) {


      await supabase
        .from("rewards")
        .update({

          unlocked: true,

          unlocked_at: new Date(),

        })
        .eq("id", reward.id);


    }

  }


}