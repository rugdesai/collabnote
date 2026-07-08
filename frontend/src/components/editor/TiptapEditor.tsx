import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useState, useRef } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./Toolbar";
import FontFamily from "@tiptap/extension-font-family";
import {TextStyle} from "@tiptap/extension-text-style";
import FontSize from "./extensions/FontSize";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import ResizeImage from "tiptap-extension-resize-image";
import socket from "../../socket";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({
  content,
  onChange,
}: TiptapEditorProps) {

  const [typingUser, setTypingUser] = useState("");

const typingTimeout = useRef<number | null>(null);

  const editor = useEditor({
    extensions: [
        StarterKit,
        Underline,
        TextStyle,
        TiptapImage,
        Color,
        Highlight,
        ResizeImage,
        FontFamily,
        FontSize,
        Link.configure({
    openOnClick: true,
    autolink: true,
  }),
    ],

    content,

    immediatelyRender: false,
    
    onUpdate: ({ editor }) => {

  const html =
    editor.getHTML();


  onChange(html);


  socket.emit(
    "send-changes",
    {

      noteId:
        window.location.pathname.split("/").pop(),

      content: html,

    }

  );

  socket.emit(
  "user-typing",
  {
    noteId:
      window.location.pathname.split("/").pop(),

    email:
      localStorage.getItem("email"),
  }
);

},
  });

  useEffect(()=>{

if(!editor) return;


const noteId =
window.location.pathname.split("/").pop();


socket.emit(
"join-note",
noteId
);


const updateHandler = (content:string)=>{


editor.commands.setContent(
content,
{
    emitUpdate:false
}
);


};



socket.on(
"receive-changes",
updateHandler
);



return ()=>{

socket.off(
"receive-changes",
updateHandler
);

};


},[editor]);

useEffect(() => {

  const typingHandler = (email:string) => {

    setTypingUser(
      `${email} is editing...`
    );


    if (typingTimeout.current) {

      clearTimeout(
        typingTimeout.current
      );

    }


    typingTimeout.current =
      window.setTimeout(()=>{

        setTypingUser("");

      },2000);

  };


  socket.on(
    "receive-typing",
    typingHandler
  );


  return ()=>{

    socket.off(
      "receive-typing",
      typingHandler
    );

  };


},[]);
  useEffect(() => {

  if (!editor) return;

  if (editor.getHTML() !== content) {

    editor.commands.setContent(
      content,
      {
        emitUpdate: false,
      }
    );

  }
  

}, [content, editor]);

  return (
  <div className="overflow-hidden
  rounded-2xl
  bg-black
  shadow-xl">

    <Toolbar editor={editor} />
    {typingUser && (
  <p className="
    px-5
    py-2
    text-sm
    text-gray-400
  ">
    {typingUser}
  </p>
)}
    <div className="min-h-screen bg-black text-white">
        <EditorContent editor={editor}
        className="
    bg-black
    min-h-screen
    text-white
  " />
    </div>

  </div>
);
}