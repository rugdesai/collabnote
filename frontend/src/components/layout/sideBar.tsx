import { Search, LogOut } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Sidebar() {

  const navigate = useNavigate();

  const { id: noteId } = useParams();

  const [search, setSearch] = useState("");

  const [collaborators, setCollaborators] =
  useState<
    {
      id: string;
      email: string;
    }[]
  >([]);



  useEffect(() => {

  const fetchCollaborators = async () => {

    const noteId =
      window.location.pathname.split("/").pop();


    if (!noteId) return;


    try {

      const res = await api.get(
        `/collaborators/${noteId}`
      );


      setCollaborators(
        res.data
      );


    } catch(error){

      console.log(error);

    }

  };


  fetchCollaborators();


}, []);



  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("email");

    navigate("/");

  };



  const handleInvite = async () => {

    if (!noteId) {
      alert("Open a note first");
      return;
    }


    try {

      const res = await api.post(
        `/collaborators/${noteId}/link`
      );


      await navigator.clipboard.writeText(
        res.data.link
      );


      alert(
        "Invite link copied ;)"
      );


    } catch (error) {

      console.log(error);

      alert(
        "Could not create invite link"
      );

    }

  };



  const filteredCollaborators =
    collaborators.filter((person) =>
      person.email
        .toLowerCase()
        .includes(search.toLowerCase())
    );



  return (

    <div className="w-72 h-screen bg-[#111111] border-r border-zinc-800 flex flex-col p-6">


      {/* count */}
      <div className="flex items-center gap-3 p-2 rounded-lg">

        <div className="w-2 h-2 rounded-full bg-[#F6D85B]" />

        <span className="text-sm text-zinc-200">

          {collaborators.length} Collaborators

        </span>

      </div>



      {/* Logo */}
      <div className="mb-10">

        <h1 className="text-3xl">

          <span
            className="font-serif italic"
            style={{ color:"#f4d953" }}
          >

            CollabNote

          </span>

        </h1>

      </div>



      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-4">

        Collaborators

      </p>



      {/* Search */}

      <div className="relative mb-5">

        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />


        <input

          value={search}

          onChange={(e)=>
            setSearch(e.target.value)
          }

          placeholder="Search collaborators..."

          className="
          w-full rounded-lg text-sm
          bg-[#1B1B1B]
          border border-zinc-700
          py-2 pl-11 pr-4
          text-white
          focus:outline-none
          focus:border-[#f4d953]
          "

        />

      </div>



      {/* collaborators */}

      <div className="flex-1 overflow-y-auto space-y-2">


        {filteredCollaborators.map((person)=>(

          <div
            key={person.id}
            className="
            flex items-center gap-3
            p-1 rounded-lg
            hover:bg-[#1C1C1C]
            "
          >

            <div className="w-2 h-2 rounded-full bg-[#f4d953]" />


            <span className="text-sm text-white">

              {person.email}

            </span>


          </div>

        ))}

      </div>

      {/* LOGOUT */}

      <button

        onClick={handleLogout}

        className="
        flex text-sm font-medium
        items-center gap-2 mt-8
        text-zinc-400
        hover:text-[#F6D85B]
        "

      >

        <LogOut size={16}/>

        Logout


      </button>


    </div>

  );

}