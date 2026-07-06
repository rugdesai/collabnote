import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import NoteCard from "./noteCard";
import Button from "../common/button";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
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
      console.log("FULL RESPONSE:", res.data);
      console.log("NOTES:", res.data.notes);
      console.log("FIRST NOTE:", res.data.notes[0]);
      setNotes(res.data.notes);
    } catch (error) {
      console.error(error);
    }
  };

  const createNote = async () => {
  console.log("1. Button clicked");

  try {
    console.log("2. About to send POST request");

    const res = await api.post("/notes", {
      title: "Untitled Note",
      content: "New Note",
    });

    console.log("3. POST successful", res.data);

    await fetchNotes();

    console.log("4. Notes refreshed");
  } catch (error) {
    console.error("5. Error:", error);
  }
};

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  console.log("Number of notes:", notes.length);
  console.log(notes);

  return (
    <div className="w-full flex flex-col">
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

        <button
        onClick={() => {
          console.log("WORKING");
          createNote();
        }}
        className="bg-yellow-400 text-black px-5 py-2 rounded-lg">
          + new note
        </button>

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
      <div className="grid grid-cols-[1fr_270px_270px] px-5 pb-3 text-xs uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
        <p>Title</p>
        <p>Created</p>
        <p>Last Edited</p>
      </div>

      {/* Notes */}
      <div className="flex-1 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => navigate(`/notes/${note.id}`)}
            className="cursor-pointer"
          >
            <NoteCard note={note} />
          </div>
        ))}
      </div>
    </div>
  );
}