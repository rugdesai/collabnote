import type { Note } from "../../types/note";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="grid grid-cols-3 items-center px-5 py-4 rounded-lg hover:bg-[#181818] transition cursor-pointer border-b border-zinc-800">

      {/* Title */}
      <div>
        <h3 className="text-zinc-100 font-semisemisemibold">{note.title}</h3>
      </div>

      {/* CREATED */}

<p className="text-zinc-400 text-sm">
   {new Date(note.createdAt).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}

</p>
      

      {/* Last Updated */}
      <div className="text-zinc-400 text-sm">
        {new Date(note.updatedAt).toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
        </div>

    </div>
  );
}