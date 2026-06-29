import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import NoteCard from "./noteCard";
import Button from "../common/button";
import api from "../../services/api";
import type { Note } from "../../types/note";

interface NotesListProps {
  selectedNote: Note | null;
  setSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>;
}

export default function NotesList({
  setSelectedNote,
}: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      console.log(res.data);
      setNotes(res.data.notes);
    } catch (error) {
      console.error(error);
    }
  };

  const createNote = async () => {
    try {
      await api.post("/notes", {
        title: "Untitled Note",
        content: "",
      });

      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <span
            className="font-serif italic font-semibold"
            style={{ color: "#f4d953" }}
          >
            your notes
          </span>

          <p className="text-sm hover:text-zinc-400 transition">
            manage and collaborate on your notes.
          </p>
        </div>

        <Button
          onClick={createNote}
          className="w-fit px-5 py-2 text-sm italic font-semibold rounded-lg bg-[#f4d953] hover:bg-[#F2D14B] transition-all duration-200"
        >
          + new note
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          placeholder="Search notes..."
          className="w-full bg-[#141414]
            border border-zinc-800
            rounded-lg
            py-2
            pl-10
            pr-4
            text-sm
            text-white
            placeholder:text-zinc-500
            focus:outline-none
            focus:border-[#f4d953]
            transition"
        />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-3 px-5 pb-3 text-xs uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
        <p>Title</p>
        <p>Collaborators</p>
        <p>Last Edited</p>
      </div>

      {/* Notes */}
      <div className="flex-1 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => setSelectedNote(note)}
            className="cursor-pointer"
          >
            <NoteCard note={note} />
          </div>
        ))}
      </div>
    </div>
  );
}