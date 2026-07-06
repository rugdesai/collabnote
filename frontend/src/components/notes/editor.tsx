import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { updateNote, deleteNote } from "../../services/api";
import type { Note } from "../../types/note";
import socket from "../../socket";
import TiptapEditor from "../editor/TiptapEditor";
import { Trash2, Share2 } from "lucide-react";


export default function Editor() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState("");
    
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  const [titleCleared, setTitleCleared] = useState(false);

  const firstLoad = useRef(true);

  // Fetch note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);

        // If your backend returns { note: {...} }, change these 3 lines to:
        // const fetchedNote = res.data.note;

        const fetchedNote = res.data;

        setNote(fetchedNote);
        setTitle(fetchedNote.title);
        setContent(fetchedNote.content);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  // Auto Save
  useEffect(() => {
    if (!id) return;

    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

  const timeout = setTimeout(async () => {
      try {
        await updateNote(id, {
          title,
          content,
        });

        setSaveStatus("saved");
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }, 700);

    return () => clearTimeout(timeout);
  }, [title, content, id]);

    useEffect(() => {
  socket.connect();

  if (id) {
    socket.emit("join-note", id);
  }

  return () => {
    socket.disconnect();
  };
}, [id]);

  useEffect(() => {

  socket.on(
    "receive-note-change",
    (newContent) => {

      setContent(newContent);

    }
  );


  return () => {

    socket.off(
      "receive-note-change"
    );

  };

}, []);

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500">
        Loading...
      </div>
    );
  }

  const handleDelete = async () => {
  if (!id) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this note?"
  );

  if (!confirmDelete) return;

  try {
    await deleteNote(id);

    navigate("/dashboard");
  } catch (error) {
    console.error(error);
  }
};
  
const handleShare = async () => {

  if (!id) return;

  try {

    const res = await api.post(
      `/collaborators/${id}/link`
    );


    await navigator.clipboard.writeText(
      res.data.link
    );


    alert("Invite link copied ;)");


  } catch (error) {

    console.log(error);

    alert("Could not create invite link");

  }

};


  return (
    <div className="max-w-5xl
  mx-auto
  p-6
  space-y-4
  min-h-screen
  bg-black">
      <input
  className="
    w-full
    bg-transparent
    text-3xl
    font-bold
    text-white
    outline-none
    border-none
  "
  value={title}
  onFocus={() => {
    if (!titleCleared && title === "Untitled Note") {
      setTitle("");
      setTitleCleared(true);
    }
  }}
  onChange={(e) => setTitle(e.target.value)}
/>
    
    <button
onClick={handleShare}
className="
absolute
    right-40
    top-7.25
      float-right
      p-2
      rounded-lg
      text-red-400
      hover:bg-red-500/20
      transition
"
>

<Share2 size={18}/>

</button>


   <button
    onClick={handleDelete}
    className="
      absolute
    right-27.5
    top-7.25
      float-right
      p-2
      rounded-lg
      text-red-400
      hover:bg-red-500/20
      transition
    "
  >
    <Trash2 size={18}/>
  </button>

  <TiptapEditor
  content={content}

  onChange={(newContent) => {

    setContent(newContent);

    socket.emit(
      "note-change",
      {
        noteId: id,
        content: newContent,
      }
    );

  }}
/>

  </div>
       
       
  );
}