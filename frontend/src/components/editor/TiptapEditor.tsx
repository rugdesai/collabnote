import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Toolbar from "./Toolbar";
import FontFamily from "@tiptap/extension-font-family";
import {TextStyle} from "@tiptap/extension-text-style";
import FontSize from "./extensions/FontSize";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
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
  const editor = useEditor({
    extensions: [
        StarterKit,
        Underline,
        Image,
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
false
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

  if (!editor) return;

  if (editor.getHTML() !== content) {

    editor.commands.setContent(
      content,
      {
        emitsUpdate: false,
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