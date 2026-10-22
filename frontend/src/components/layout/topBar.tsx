import { useState } from "react";


export default function Topbar() {


  const [user] = useState(() => localStorage.getItem("email") || "User");

  return (

    <div className="h-24 border-b border-zinc-800 flex items-center justify-between px-10">


      <div>


        <p className="text-sm text-zinc-500">

          welcome back,

        </p>


        <h1 className="text-2xl font-semisemibold text-white">

          {user}

        </h1>


      </div>



      <p className="text-sm italic hover:text-[#f4d953] transition cursor-pointer">

        Write. Collaborate. Create.

      </p>



    </div>

  );

}