"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { supabase } from "@/lib/supabase";
import PersonalBestModal from "@/components/personal-bests/PersonalBestModal";



type PersonalBest = {
  id: string;
  category: string;
  name: string;
  metric: string;
  value: string | null;
  target: string | null;
  unit: string | null;
};





export default function PersonalBestsPage() {


  const [personalBests, setPersonalBests] =
    useState<PersonalBest[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [showModal, setShowModal] =
    useState(false);







  useEffect(() => {

    loadPersonalBests();

  }, []);








  async function loadPersonalBests() {


    setLoading(true);



    const {
      data: { user },
    } = await supabase.auth.getUser();




    if (!user) {

      setLoading(false);

      return;

    }






    const { data, error } = await supabase
      .from("personal_bests")
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





    setPersonalBests(data ?? []);

    setLoading(false);


  }








  return (

    <main className="min-h-screen bg-zinc-950 pb-24 text-white">


      <div className="mx-auto max-w-md px-6 py-8">





        <h1 className="text-4xl font-bold">
          🏆 Personal Bests
        </h1>




        <p className="mt-2 text-zinc-500">
          Track your biggest improvements.
        </p>







        <button

          type="button"

          onClick={() =>
            setShowModal(true)
          }

          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 p-4 font-semibold text-black hover:bg-emerald-400"

        >

          <Plus size={20} />

          Add Personal Best

        </button>









        {loading ? (



          <div className="mt-6 rounded-3xl bg-zinc-900 p-6 text-zinc-400">

            Loading personal bests...

          </div>





        ) : personalBests.length === 0 ? (



          <div className="mt-6 rounded-3xl bg-zinc-900 p-8 text-center">


            <p className="text-zinc-400">
              No personal bests yet.
            </p>


            <p className="mt-2 text-sm text-zinc-500">
              Add your first goal and start improving.
            </p>


          </div>





        ) : (




          <div className="mt-6 space-y-4">



            {personalBests.map((pb) => (



              <div

                key={pb.id}

                className="rounded-3xl bg-zinc-900 p-5"

              >





                <div className="flex items-start justify-between">


                  <div>


                    <h2 className="text-xl font-bold">
                      {pb.name}
                    </h2>


                    <p className="mt-1 text-sm text-zinc-500">
                      {pb.category}
                    </p>


                  </div>





                  {pb.unit && (

                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">

                      {pb.unit}

                    </span>

                  )}



                </div>







                <div className="mt-5 space-y-2">


                  <div className="flex justify-between">

                    <span className="text-zinc-400">
                      Current
                    </span>


                    <span className="font-bold">
                      {pb.value ?? "-"}
                    </span>

                  </div>





                  <div className="flex justify-between">

                    <span className="text-zinc-400">
                      Target
                    </span>


                    <span className="font-bold">
                      {pb.target ?? "-"}
                    </span>

                  </div>



                </div>




              </div>



            ))}



          </div>




        )}









        {showModal && (



          <PersonalBestModal


            onClose={() =>
              setShowModal(false)
            }



            onSaved={() => {

              loadPersonalBests();

              setShowModal(false);

            }}



          />



        )}







      </div>


    </main>

  );

}