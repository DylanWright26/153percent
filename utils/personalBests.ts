import { supabase } from "@/lib/supabase";


export async function checkPersonalBest(
  userId: string,
  activityId: string
) {


  const {
    data: activity,
    error: activityError,
  } = await supabase
    .from("activities")
    .select("*")
    .eq("id", activityId)
    .single();



  if (activityError || !activity) {

    console.log(
      "NO ACTIVITY FOUND:",
      activityError
    );

    return;

  }



  console.log(
    "CHECKING ACTIVITY:",
    activity
  );





  // RUN PB CHECK

  if (
    activity.type !== "Run" ||
    !activity.duration ||
    !activity.distance
  ) {

    console.log(
      "NOT A RUN OR MISSING DATA"
    );

    return;

  }






  const {
    data: pb,
    error: pbError,
  } = await supabase
    .from("personal_bests")
    .select("*")
    .eq("user_id", userId)
    .eq("metric", "5k_time")
    .single();





  if (pbError || !pb) {

    console.log(
      "NO PB FOUND:",
      pbError
    );

    return;

  }





  console.log(
    "FOUND PB:",
    pb
  );







  const newTime =
    convertTimeToSeconds(
      activity.duration
    );


  const oldTime =
    convertTimeToSeconds(
      String(pb.value)
    );





  console.log(
    "COMPARE:",
    newTime,
    oldTime
  );







  if (newTime >= oldTime) {

    console.log(
      "NOT A NEW PB"
    );

    return;

  }







  console.log(
    "NEW PB DETECTED"
  );







  const updateResponse =
    await supabase
      .from("personal_bests")
      .update({
        value: activity.duration,
      })
      .eq(
        "id",
        pb.id
      )
      .select();






  console.log(
    "UPDATE RESPONSE:",
    updateResponse
  );






  if (updateResponse.error) {

    console.log(
      "PB UPDATE FAILED:",
      updateResponse.error
    );

    return {

      type: "ERROR",

      message:
        updateResponse.error.message,

    };

  }






  return {

    type: "NEW_PB",

    name:
      pb.name,

    oldValue:
      pb.value,

    newValue:
      activity.duration,

  };


}








function convertTimeToSeconds(
  time: string
) {


  const parts =
    time.split(":");



  const minutes =
    Number(parts[0]);



  const seconds =
    Number(parts[1] ?? 0);




  return (
    minutes * 60 +
    seconds
  );

}