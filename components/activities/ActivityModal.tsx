"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";


const activityTypes = [
  "Run",
  "Gym",
  "Football",
  "Lifestyle",
  "Money",
];


type Activity = {
  id: string;
  type: string;
  date: string;
  notes: string | null;

  distance?: number | null;
  duration?: string | null;

  goals?: number | null;
  assists?: number | null;
  games?: number | null;
  minutes?: number | null;

  exercise?: string | null;
  weight?: number | null;
  reps?: number | null;
  sets?: number | null;
};



type Props = {
  onClose: () => void;
  onSaved: () => void;
  activity?: Activity | null;
};





export default function ActivityModal({
  onClose,
  onSaved,
  activity,
}: Props) {



  const [type, setType] = useState(
    activity?.type ?? "Run"
  );


  const [notes, setNotes] = useState(
    activity?.notes ?? ""
  );



  const [distance, setDistance] = useState(
    activity?.distance?.toString() ?? ""
  );


  const [duration, setDuration] = useState(
    activity?.duration ?? ""
  );



  const [goals, setGoals] = useState(
    activity?.goals?.toString() ?? ""
  );


  const [assists, setAssists] = useState(
    activity?.assists?.toString() ?? ""
  );


  const [games, setGames] = useState(
    activity?.games?.toString() ?? ""
  );


  const [minutes, setMinutes] = useState(
    activity?.minutes?.toString() ?? ""
  );



  const [exercise, setExercise] = useState(
    activity?.exercise ?? ""
  );


  const [weight, setWeight] = useState(
    activity?.weight?.toString() ?? ""
  );


  const [reps, setReps] = useState(
    activity?.reps?.toString() ?? ""
  );


  const [sets, setSets] = useState(
    activity?.sets?.toString() ?? ""
  );







  async function saveActivity() {


    const {
      data: { user },
    } = await supabase.auth.getUser();



    if (!user) {
      return;
    }







    const activityData = {


      user_id: user.id,


      type,


      notes,



      distance:
        type === "Run" && distance
          ? Number(distance)
          : null,



      duration:
        type === "Run"
          ? duration
          : null,



      goals:
        type === "Football" && goals
          ? Number(goals)
          : null,


      assists:
        type === "Football" && assists
          ? Number(assists)
          : null,


      games:
        type === "Football" && games
          ? Number(games)
          : null,


      minutes:
        type === "Football" && minutes
          ? Number(minutes)
          : null,



      exercise:
        type === "Gym"
          ? exercise
          : null,


      weight:
        type === "Gym" && weight
          ? Number(weight)
          : null,


      reps:
        type === "Gym" && reps
          ? Number(reps)
          : null,


      sets:
        type === "Gym" && sets
          ? Number(sets)
          : null,


    };







    let error;
    let activityId = activity?.id;





    if (activity) {


      const result = await supabase
        .from("activities")
        .update(activityData)
        .eq(
          "id",
          activity.id
        );


      error = result.error;



    } else {



      const result = await supabase
        .from("activities")
        .insert(activityData)
        .select()
        .single();


      error = result.error;

      activityId = result.data?.id;


    }






    if (error) {

      alert(error.message);

      return;

    }






    






    onSaved();

    onClose();


  }









  return (

    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-6">


      <div className="mx-auto mt-10 w-full max-w-md rounded-3xl bg-zinc-900 p-6">



        <h2 className="text-2xl font-bold">

          {activity
            ? "✏️ Edit Activity"
            : "📈 Log Activity"}

        </h2>






        <div className="mt-6 space-y-5">





          <div>

            <label className="text-sm text-zinc-400">
              Activity Type
            </label>


            <select

              value={type}

              onChange={(e) =>
                setType(e.target.value)
              }

              className="mt-2 w-full rounded-xl bg-zinc-800 p-3"

            >

              {activityTypes.map((item) => (

                <option key={item}>
                  {item}
                </option>

              ))}

            </select>

          </div>







          {type === "Run" && (

            <div className="space-y-4">

              <h3 className="font-semibold">
                🏃 Run Details
              </h3>


              <Input
                label="Distance (km)"
                value={distance}
                setValue={setDistance}
                placeholder="Example: 5"
              />


              <Input
                label="Time"
                value={duration}
                setValue={setDuration}
                placeholder="Example: 24:32"
              />


            </div>

          )}







          {type === "Football" && (

            <div className="space-y-4">

              <h3 className="font-semibold">
                ⚽ Match Details
              </h3>


              <Input
                label="Games Played"
                value={games}
                setValue={setGames}
                placeholder="Example: 1"
              />


              <Input
                label="Goals"
                value={goals}
                setValue={setGoals}
                placeholder="Example: 2"
              />


              <Input
                label="Assists"
                value={assists}
                setValue={setAssists}
                placeholder="Example: 1"
              />


              <Input
                label="Minutes Played"
                value={minutes}
                setValue={setMinutes}
                placeholder="Example: 90"
              />

            </div>

          )}







          {type === "Gym" && (

            <div className="space-y-4">

              <h3 className="font-semibold">
                💪 Workout Details
              </h3>


              <Input
                label="Exercise"
                value={exercise}
                setValue={setExercise}
                placeholder="Example: Bench Press"
              />


              <Input
                label="Weight (kg)"
                value={weight}
                setValue={setWeight}
                placeholder="Example: 80"
              />


              <Input
                label="Sets"
                value={sets}
                setValue={setSets}
                placeholder="Example: 3"
              />


              <Input
                label="Reps"
                value={reps}
                setValue={setReps}
                placeholder="Example: 5"
              />

            </div>

          )}







          <div>

            <label className="text-sm text-zinc-400">
              Notes
            </label>


            <textarea

              value={notes}

              onChange={(e) =>
                setNotes(e.target.value)
              }

              placeholder="Extra details..."

              className="mt-2 w-full rounded-xl bg-zinc-800 p-3"

            />

          </div>






        </div>







        <div className="mt-6 flex gap-3">


          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-zinc-800 py-3"
          >
            Cancel
          </button>



          <button

            onClick={saveActivity}

            className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-black"

          >

            {activity
              ? "Update"
              : "Save"}

          </button>


        </div>



      </div>


    </div>

  );

}







function Input({
  label,
  value,
  setValue,
  placeholder,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}) {


  return (

    <div>

      <label className="text-sm text-zinc-400">
        {label}
      </label>


      <input

        value={value}

        onChange={(e) =>
          setValue(e.target.value)
        }

        placeholder={placeholder}

        className="mt-2 w-full rounded-xl bg-zinc-800 p-3"

      />

    </div>

  );

}