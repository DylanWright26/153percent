"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";


const categories = [
  "Fitness",
  "Football",
  "Gaming",
  "Lifestyle",
  "Money",
  "Other",
];



type PersonalBest = {
  id: string;
  category: string;
  name: string;
  metric: string;
  value: string | null;
  target: string | null;
  unit: string | null;
};



type Props = {
  onClose: () => void;
  onSaved: () => void;
  personalBest?: PersonalBest | null;
};





export default function PersonalBestModal({
  onClose,
  onSaved,
  personalBest,
}: Props) {


  const [category, setCategory] = useState(
    personalBest?.category ?? "Fitness"
  );


  const [name, setName] = useState(
    personalBest?.name ?? ""
  );


  const [metric, setMetric] = useState(
    personalBest?.metric ?? ""
  );


  const [value, setValue] = useState(
    personalBest?.value?.toString() ?? ""
  );


  const [target, setTarget] = useState(
    personalBest?.target?.toString() ?? ""
  );


  const [unit, setUnit] = useState(
    personalBest?.unit ?? ""
  );







  async function savePB() {


    if (!name.trim()) {
      return;
    }




    const {
      data: { user },
    } = await supabase.auth.getUser();




    if (!user) {
      return;
    }






    const pbData = {

      user_id: user.id,

      category,

      name,

      metric,

      value:
  value || null,

target:
  target || null,

      unit,

    };






    let error;



    if (personalBest) {


      const result = await supabase
        .from("personal_bests")
        .update(pbData)
        .eq(
          "id",
          personalBest.id
        );


      error = result.error;



    } else {



      const result = await supabase
        .from("personal_bests")
        .insert(pbData);


      error = result.error;


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

          {personalBest
            ? "✏️ Edit Personal Best"
            : "🏆 Add Personal Best"}

        </h2>






        <div className="mt-6 space-y-5">





          <div>

            <label className="text-sm text-zinc-400">
              Category
            </label>


            <select

              value={category}

              onChange={(e) =>
                setCategory(e.target.value)
              }

              className="mt-2 w-full rounded-xl bg-zinc-800 p-3"

            >

              {categories.map((item) => (

                <option key={item}>
                  {item}
                </option>

              ))}

            </select>

          </div>







          <Input

            label="Name"

            value={name}

            setValue={setName}

            placeholder="Example: 5K Run"

          />





          <Input

            label="Metric"

            value={metric}

            setValue={setMetric}

            placeholder="Example: Time"

          />





          <Input

            label="Current Value"

            value={value}

            setValue={setValue}

            placeholder="Example: 24.32"

          />





          <Input

            label="Target"

            value={target}

            setValue={setTarget}

            placeholder="Example: 22"

          />





          <Input

            label="Unit"

            value={unit}

            setValue={setUnit}

            placeholder="Example: minutes / kg / goals"

          />





        </div>








        <div className="mt-8 flex gap-3">


          <button

            onClick={onClose}

            className="flex-1 rounded-xl bg-zinc-800 py-3"

          >

            Cancel

          </button>





          <button

            onClick={savePB}

            className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-black"

          >

            {personalBest
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