"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";
import { checkAchievements } from "@/utils/achievements";
import MilestoneModal, {
  Milestone,
} from "@/components/milestones/MilestoneModal";


export default function MilestonesPage() {
  const { refreshProfile } = useApp();

  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [selectedMilestone, setSelectedMilestone] =
    useState<Milestone | null>(null);



  useEffect(() => {
    loadMilestones();
  }, []);



  async function loadMilestones() {

    setLoading(true);


    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) {
      setLoading(false);
      return;
    }


    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .eq("user_id", user.id)
      .order("completed", { ascending: true })
      .order("created_at", { ascending: false });


    if (error) {
      console.error(error);
    }


    setMilestones(data ?? []);

    setLoading(false);
  }



  async function completeMilestone(
    milestone: Milestone
  ) {

    if (milestone.completed) {
      return;
    }


    const { error } = await supabase
      .from("milestones")
      .update({
        completed: true,
      })
      .eq("id", milestone.id);


    if (error) {
      alert(error.message);
      return;
    }


    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (user) {

      const { error: xpError } =
        await supabase.rpc(
          "add_xp",
          {
            p_user_id: user.id,
            p_amount: milestone.xp_reward,
          }
        );
      


      if (xpError) {
        alert(xpError.message);
        return;
      }
    await checkAchievements(user.id);

    }
    await refreshProfile();
    await loadMilestones();

  }
    async function deleteMilestone(
    id: string
  ) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this milestone?"
    );


    if (!confirmed) {
      return;
    }


    const { error } = await supabase
      .from("milestones")
      .delete()
      .eq("id", id);


    if (error) {
      alert(error.message);
      return;
    }


    await loadMilestones();

  }



  function openCreateModal() {

    setSelectedMilestone(null);

    setShowModal(true);

  }



  function openEditModal(
    milestone: Milestone
  ) {

    setSelectedMilestone(milestone);

    setShowModal(true);

  }



  return (

    <main className="min-h-screen bg-zinc-950 pb-24 text-white">

      <div className="mx-auto max-w-md px-6 py-8">


        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              🏁 Milestones
            </h1>


            <p className="mt-2 text-zinc-500">
              Long-term goals that never reset.
            </p>

          </div>



          <button
            onClick={openCreateModal}
            className="rounded-xl bg-green-600 px-4 py-2 font-semibold hover:bg-green-500"
          >
            + Add
          </button>


        </div>



        {loading ? (

          <div className="mt-8 text-zinc-500">
            Loading...
          </div>


        ) : milestones.length === 0 ? (

          <div className="mt-8 rounded-3xl bg-zinc-900 p-6">

            <h2 className="text-xl font-semibold">
              No milestones yet
            </h2>


            <p className="mt-3 text-zinc-400">
              Click "Add" to create your first milestone.
            </p>

          </div>


        ) : (

          <div className="mt-8 space-y-4">


            {milestones.map((milestone) => (

              <div
                key={milestone.id}
                className="rounded-3xl bg-zinc-900 p-5"
              >


                <div className="flex items-center justify-between">

                  <h2 className="text-lg font-semibold">
                    {milestone.title}
                  </h2>


                  <span className="font-medium text-green-400">
                    +{milestone.xp_reward} XP
                  </span>

                </div>


                {milestone.category && (

                  <p className="mt-2 text-xs text-zinc-500">
                    {milestone.category}
                  </p>

                )}



                {milestone.description && (

                  <p className="mt-3 text-zinc-400">
                    {milestone.description}
                  </p>

                )}
                                
                <div className="mt-5 flex items-center justify-between">


                  <div>

                    {milestone.completed ? (

                      <span className="font-medium text-green-400">
                        ✅ Completed
                      </span>

                    ) : (

                      <button
                        onClick={() =>
                          completeMilestone(milestone)
                        }
                        className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-black hover:bg-green-500"
                      >
                        Complete
                      </button>

                    )}

                  </div>



                  <div className="flex gap-3">


                    <button
                      onClick={() =>
                        openEditModal(milestone)
                      }
                      className="rounded-xl bg-zinc-800 p-2 hover:bg-zinc-700"
                    >
                      <Pencil size={18} />
                    </button>



                    <button
                      onClick={() =>
                        deleteMilestone(milestone.id)
                      }
                      className="rounded-xl bg-red-500/20 p-2 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={18} />
                    </button>


                  </div>


                </div>


              </div>

            ))}


          </div>

        )}



        {showModal && (

          <MilestoneModal

            milestone={
              selectedMilestone ?? undefined
            }

            onClose={() =>
              setShowModal(false)
            }

            onSaved={async () => {

  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (user) {
    await checkAchievements(user.id);
  }


  await loadMilestones();

  setShowModal(false);

}}

          />

        )}


      </div>

    </main>

  );

}