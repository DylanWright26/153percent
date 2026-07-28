"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import ActivityModal from "@/components/activities/ActivityModal";



type Activity = {
  id: string;

  type: string;

  date: string;

  notes: string | null;

  distance: number | null;
  duration: string | null;

  goals: number | null;
  assists: number | null;
  games: number | null;
  minutes: number | null;

  exercise: string | null;
  weight: number | null;
  reps: number | null;
  sets: number | null;
};





export default function ActivitiesPage() {


  const [activities, setActivities] =
    useState<Activity[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [showModal, setShowModal] =
    useState(false);


  const [selectedActivity, setSelectedActivity] =
    useState<Activity | null>(null);






  useEffect(() => {

    loadActivities();

  }, []);







  async function loadActivities() {


    setLoading(true);



    const {
      data: { user },
    } = await supabase.auth.getUser();




    if (!user) {

      setLoading(false);

      return;

    }





    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });






    if (error) {

      console.error(error);

      setLoading(false);

      return;

    }





    setActivities(data ?? []);

    setLoading(false);


  }









  async function deleteActivity(
    id: string
  ) {


    const confirmDelete = window.confirm(
      "Delete this activity?"
    );


    if (!confirmDelete) {
      return;
    }





    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", id);





    if (error) {

      alert(error.message);

      return;

    }



    await loadActivities();


  }







  function openEdit(
    activity: Activity
  ) {

    setSelectedActivity(activity);

    setShowModal(true);

  }







  function openCreate() {

    setSelectedActivity(null);

    setShowModal(true);

  }







  function renderStats(
    activity: Activity
  ) {


    if (activity.type === "Run") {

      return (

        <>

          {activity.distance && (

            <p>
              🏃 {activity.distance}km
            </p>

          )}

          {activity.duration && (

            <p>
              ⏱️ {activity.duration}
            </p>

          )}

        </>

      );

    }





    if (activity.type === "Football") {

      return (

        <>

          <p>
            ⚽ Games: {activity.games ?? 0}
          </p>

          <p>
            ⚽ Goals: {activity.goals ?? 0}
          </p>

          <p>
            🅰️ Assists: {activity.assists ?? 0}
          </p>

          <p>
            ⏱️ Minutes: {activity.minutes ?? 0}
          </p>

        </>

      );

    }







    if (activity.type === "Gym") {

      return (

        <>

          <p>
            💪 {activity.exercise}
          </p>


          <p>
            🏋️ {activity.weight}kg
          </p>


          <p>
            Sets: {activity.sets} | Reps: {activity.reps}
          </p>

        </>

      );

    }





    return null;


  }







  return (

    <main className="min-h-screen bg-zinc-950 pb-24 text-white">


      <div className="mx-auto max-w-md px-6 py-8">





        <h1 className="text-4xl font-bold">
          📈 Tracking
        </h1>




        <p className="mt-2 text-zinc-500">
          Record your progress and improve every day.
        </p>







        <button

          onClick={openCreate}

          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 p-4 font-semibold text-black hover:bg-emerald-400"

        >

          <Plus size={20} />

          Log Activity

        </button>







        {loading ? (


          <div className="mt-6 rounded-3xl bg-zinc-900 p-6 text-zinc-400">

            Loading activities...

          </div>




        ) : activities.length === 0 ? (



          <div className="mt-6 rounded-3xl bg-zinc-900 p-8 text-center">


            <p className="text-zinc-400">
              No activities yet.
            </p>


            <p className="mt-2 text-sm text-zinc-500">
              Start logging your progress.
            </p>


          </div>




        ) : (



          <div className="mt-6 space-y-4">



            {activities.map((activity) => (



              <div

                key={activity.id}

                className="rounded-3xl bg-zinc-900 p-5"

              >




                <div className="flex items-center justify-between">


                  <h2 className="text-xl font-bold">

                    {activity.type}

                  </h2>



                  <span className="text-sm text-zinc-500">

                    {activity.date}

                  </span>



                </div>






                <div className="mt-3 space-y-1 text-zinc-300">

                  {renderStats(activity)}

                </div>






                {activity.notes && (

                  <p className="mt-3 text-zinc-400">

                    {activity.notes}

                  </p>

                )}







                <div className="mt-5 flex gap-3">


                  <button

                    onClick={() =>
                      openEdit(activity)
                    }

                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-800 py-3 hover:bg-zinc-700"

                  >

                    <Pencil size={16} />

                    Edit

                  </button>





                  <button

                    onClick={() =>
                      deleteActivity(
                        activity.id
                      )
                    }

                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/20 py-3 text-red-400 hover:bg-red-500 hover:text-white"

                  >

                    <Trash2 size={16} />

                    Delete

                  </button>



                </div>




              </div>


            ))}



          </div>



        )}









        {showModal && (



          <ActivityModal


            activity={selectedActivity}



            onClose={() => {

              setShowModal(false);

              setSelectedActivity(null);

            }}



            onSaved={() => {

              loadActivities();

              setShowModal(false);

              setSelectedActivity(null);

            }}



          />



        )}





      </div>


    </main>

  );

}