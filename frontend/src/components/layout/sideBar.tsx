import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sidebarBg from "../../assets/stripes.jpg";


export default function Sidebar() {

  const navigate = useNavigate();


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("email");

    navigate("/");

  };


  return (

    <div
      className="
      relative
      w-72
      h-screen
      overflow-hidden
      border-r
      border-zinc-800
      flex
      flex-col
      p-6
      "
    >


      {/* wallpaper */}

      <img
        src={sidebarBg}
        className="
        absolute
        inset-0
        h-full
        w-full
        object-cover
        "
      />


      {/* dark overlay */}

      <div
        className="
        absolute
        inset-0
        bg-black/35
        "
      />



      {/* content */}

      <div
        className="
        relative
        z-10
        flex
        flex-col
        h-full
        "
      >



        {/* logo bubble */}

        <div
          className="
          bg-black/80
          backdrop-blur-md
          rounded-3xl
          p-5
          shadow-xl
          border
          border-white/10
          "
        >


          <h1
            className="
            text-3xl
            font-serif
            italic
            text-[#f4d953]
            "
          >

            CollabNote

          </h1>


          <p
            className="
            mt-3
            text-sm
            text-zinc-300
            "
          >

            Write. Collaborate. Create.

          </p>


        </div>



        {/* middle quote bubble */}

        <div
          className="
          mt-10
          bg-black/70
          rounded-3xl
          p-5
          backdrop-blur
          border
          border-white/10
          "
        >

          <p
            className="
            text-white
            font-serif
            italic
            text-xl
            "
          >

            your ideas,
            <br/>
            synced instantly.

          </p>

        </div>



        <div className="flex-1"/>



        {/* logout bubble */}

        <button

          onClick={handleLogout}

          className="
          bg-black/70
          rounded-2xl
          p-4
          flex
          items-center
          gap-2
          text-zinc-300
          hover:text-[#f4d953]
          backdrop-blur
          "

        >

          <LogOut size={16}/>

          Logout

        </button>


      </div>


    </div>

  );

}