i/*mport type { Note } from "../../types/note";

interface EditorProps {
  selectedNote: Note | null;
}

export default function Editor({ selectedNote }: EditorProps) {
  if (!selectedNote) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500">
        Select a note to start editing.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <input
        value={selectedNote.title}
        readOnly
        className="bg-transparent text-3xl font-semibold outline-none"
      />

      <textarea
        value={selectedNote.content}
        readOnly
        className="flex-1 bg-transparent outline-none resize-none text-zinc-300"
      />
    </div>
  );
}
*/