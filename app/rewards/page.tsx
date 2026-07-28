"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { supabase } from "@/lib/supabase";
import RewardModal from "@/components/rewards/RewardModal";


type Reward = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;

  unlock_type: string;
  unlock_id: string | null;
  unlock_value: number;

  unlocked: boolean;
  claimed: boolean;
  claimed_at: string | null;

  unlock_name?: string;
};





export default function RewardsPage() {


  const [rewards, setRewards] =
    useState<Reward[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);






  useEffect(() => {

    loadRewards();

  }, []);







  async function loadRewards() {


    setLoading(true);



    const {
      data: { user },
    } = await supabase.auth.getUser();




    if (!user) {

      setLoading(false);

      return;

    }






    const { data, error } = await supabase
      .from("rewards")
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







    const rewardsWithNames = await Promise.all(

      (data ?? []).map(async (reward) => {


        if (!reward.unlock_id) {

          return reward;

        }



        let unlockName = null;




        if (reward.unlock_type === "mission") {

          const { data } = await supabase
            .from("missions")
            .select("name")
            .eq("id", reward.unlock_id)
            .single();


          unlockName = data?.name;

        }






        if (reward.unlock_type === "milestone") {

          const { data } = await supabase
            .from("milestones")
            .select("title")
            .eq("id", reward.unlock_id)
            .single();


          unlockName = data?.title;

        }






        if (reward.unlock_type === "achievement") {

          const { data } = await supabase
            .from("achievements")
            .select("name")
            .eq("id", reward.unlock_id)
            .single();


          unlockName = data?.name;

        }






        if (reward.unlock_type === "personal_best") {

          const { data } = await supabase
            .from("personal_bests")
            .select("name")
            .eq("id", reward.unlock_id)
            .single();


          unlockName = data?.name;

        }






        return {

          ...reward,

          unlock_name:
            unlockName ?? "Unknown goal",

        };


      })

    );






    setRewards(rewardsWithNames);

    setLoading(false);


  }








  async function claimReward(
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) {


    event.preventDefault();



    const { error } = await supabase
      .from("rewards")
      .update({

        claimed: true,

        claimed_at: new Date(),

      })
      .eq(
        "id",
        id
      );






    if (error) {

      alert(error.message);

      return;

    }






    await loadRewards();


  }









  function getUnlockText(
    reward: Reward
  ) {


    if (reward.unlock_type === "level") {

      return `Level ${reward.unlock_value}`;

    }



    if (reward.unlock_type === "streak") {

      return `${reward.unlock_value} day streak`;

    }




    if (
      reward.unlock_type === "mission" ||
      reward.unlock_type === "milestone" ||
      reward.unlock_type === "achievement" ||
      reward.unlock_type === "personal_best"
    ) {

      return reward.unlock_name ?? "Specific goal";

    }





    return "Unknown requirement";


  }







  const availableRewards = rewards.filter(
    (reward) =>
      reward.unlocked &&
      !reward.claimed
  );


  const lockedRewards = rewards.filter(
    (reward) =>
      !reward.unlocked
  );


  const claimedRewards = rewards.filter(
    (reward) =>
      reward.claimed
  );









  function RewardCard({
    reward,
  }: {
    reward: Reward;
  }) {


    return (

      <div
        className="rounded-3xl bg-zinc-900 p-5"
      >



        <div className="flex items-start justify-between">


          <div>


            <h2 className="text-lg font-bold">
              🎁 {reward.name}
            </h2>



            {reward.description && (

              <p className="mt-2 text-sm text-zinc-400">
                {reward.description}
              </p>

            )}




            {reward.category && (

              <p className="mt-2 text-sm text-zinc-500">
                {reward.category}
              </p>

            )}



          </div>




          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">

            {reward.unlock_type.replace("_", " ")}

          </span>



        </div>






        <div className="mt-4 text-sm text-zinc-400">


          Unlock:


          <span className="ml-1 text-white">

            {getUnlockText(reward)}

          </span>


        </div>






        <div className="mt-4">


          {reward.claimed ? (


            <span className="text-green-400">
              ✅ Claimed
            </span>



          ) : reward.unlocked ? (


            <div className="space-y-3">


              <p className="text-green-400">
                🎉 Ready to claim
              </p>



              <button
                type="button"
                onClick={(e) =>
                  claimReward(
                    e,
                    reward.id
                  )
                }
                className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-black hover:bg-emerald-400"
              >

                Claim Reward

              </button>


            </div>



          ) : (


            <span className="text-zinc-500">
              🔒 Locked
            </span>


          )}



        </div>


      </div>

    );

  }








  return (

    <main className="min-h-screen bg-zinc-950 pb-24 text-white">


      <div className="mx-auto max-w-md px-6 py-8">



        <h1 className="text-4xl font-bold">
          🎁 Rewards
        </h1>



        <p className="mt-2 text-zinc-500">
          Earn rewards by improving every day.
        </p>






        <button

          type="button"

          onClick={() =>
            setShowModal(true)
          }

          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 p-4 font-semibold text-black hover:bg-emerald-400"

        >

          <Plus size={20} />

          Add Reward

        </button>







        {loading ? (


          <div className="mt-6 rounded-3xl bg-zinc-900 p-8 text-center">

            Loading rewards...

          </div>



        ) : (



          <div className="mt-8 space-y-8">





            {availableRewards.length > 0 && (

              <section>

                <h2 className="mb-4 text-xl font-bold">
                  🎉 Available
                </h2>


                <div className="space-y-4">

                  {availableRewards.map(
                    (reward) => (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                      />
                    )
                  )}

                </div>


              </section>

            )}







            {lockedRewards.length > 0 && (

              <section>

                <h2 className="mb-4 text-xl font-bold">
                  🔒 Locked
                </h2>


                <div className="space-y-4">

                  {lockedRewards.map(
                    (reward) => (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                      />
                    )
                  )}

                </div>


              </section>

            )}







            {claimedRewards.length > 0 && (

              <section>

                <h2 className="mb-4 text-xl font-bold">
                  ✅ Claimed
                </h2>


                <div className="space-y-4">

                  {claimedRewards.map(
                    (reward) => (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                      />
                    )
                  )}

                </div>


              </section>

            )}





          </div>



        )}







        {showModal && (


          <RewardModal

            onClose={() =>
              setShowModal(false)
            }


            onSaved={() => {

              loadRewards();

              setShowModal(false);

            }}


          />


        )}






      </div>


    </main>

  );

}