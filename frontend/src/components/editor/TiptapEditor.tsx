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

import ResizeImage from "tiptap-extension-resize-image";


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
        StarterKit.configure({ link: false, underline: false }),
        Underline,
        TextStyle,

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
    
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

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