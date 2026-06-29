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

      {/* Collaborators */}
      <div className="text-zinc-400 text-sm">
        {note.collaborators.length}
      </div>

      {/* Last Updated */}
      <div className="text-zinc-400 text-sm">
        {note.updatedAt}
      </div>

    </div>
  );
}