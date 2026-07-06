import { useState } from "react";
import type { Note } from "../types/note";
import Sidebar from "../components/layout/sideBar";
import Topbar from "../components/layout/topBar";
import NotesList from "../components/notes/notesList";
import Editor from "../components/notes/editor";

export default function Dashboard() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <div className="h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <div className="flex-1 p-8 overflow-y-auto">

            <NotesList
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
            />
          </div>
        </div>

      </div>
  );
}