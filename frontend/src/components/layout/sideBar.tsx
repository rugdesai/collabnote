import { Search, LogOut, UserPlus } from "lucide-react";

const collaborators = [
  "Riya Sharma",
  "Aman Verma",
  "Neha Patel",
  "Rohit Kumar",
  "Aryan Singh",
  "Priya Patel",
  "Rahul Shah",
  "Isha Gupta",
];

export default function Sidebar() {
  return (
    <div className="w-72 h-screen bg-[#111111] border-r border-zinc-800 flex flex-col p-6">

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1A1A1A] transition">

    <div className="w-2 h-2 rounded-full bg-[#F6D85B]" />

    <span className="text-sm text-zinc-200">
        {collaborators.length} Collaborators
    </span>

</div>
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-3xl font-semisemibold">
          <span
          className="font-serif italic font-semisemibold"
          style={{ color: "#f4d953" }}
          >
            CollabNote
        </span>
        </h1>
      </div>

      {/* Heading */}
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
          type="text"
          placeholder="Search collaborators..."
          className="w-full rounded-lg text-sm bg-[#1B1B1B] border border-zinc-700 py-2 pl-11 pr-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#f4d953]"
        />
      </div>

      {/* Scrollable Collaborators */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">

        {collaborators.map((person) => (
          <div
            key={person}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-[#1C1C1C] transition cursor-pointer"
          >

            <div className="w-2 h-2 rounded-full bg-[#f4d953] flex-shrink-0"></div>

            <span className="text-sm text-white">
              {person}
            </span>

          </div>
        ))}

      </div>

      {/* Invite */}
      <button className="flex text-sm font-medium items-center gap-2 mt-5 text-[#f4d953] hover:text-yellow-300 transition cursor-pointer">

        <UserPlus size={15} />

        Invite Collaborator

      </button>

      {/* Logout */}
      <button className="flex text-sm font-medium items-center gap-2 mt-8 text-zinc-400 hover:text-[#F6D85B] transition cursor-pointer">

        <LogOut size={16} />

        Logout

      </button>

    </div>
  );
}