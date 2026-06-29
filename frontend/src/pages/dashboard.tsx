import { useState } from "react";
import type { Note } from "../types/note";
// import Editor from "../components/notes/editor";
import Sidebar from "../components/layout/sideBar";
import Topbar from "../components/layout/topBar";
import NotesList from "../components/notes/notesList";

export default function Dashboard() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <div className="h-screen bg-black text-white flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <Topbar />

        {/* Content */}
      <div className="flex-1 flex overflow-hidden">
  <div className="flex-[1] border-r border-zinc-900 p-8">
    <NotesList
      selectedNote={selectedNote}
      setSelectedNote={setSelectedNote}
    />
  </div>
</div>
      </div>
    </div>
  );
}