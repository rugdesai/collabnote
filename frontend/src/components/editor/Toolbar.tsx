import { Editor } from "@tiptap/react";


import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Palette,
  Highlighter,
  Link,
  Image,
  Undo2,
  Redo2,
  Trash2,
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const Button = ({
  onClick,
  active,
  children,
}: {
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`flex items-center justify-center
      w-6 h-6
      rounded-md
      transition-all
      text-black ${
        active
          ? "bg-yellow-400"
          : "hover:bg-yellow-100"
      }`}
  >
    {children}
  </button>
);

  return (
    <div className="flex items-center gap-2 bg-[#FFF8DC] px-5 py-3">

        <select
  className="h-10 w-28 rounded-md border border-yellow-400 bg-black px-3 text-sm text-white"
  defaultValue=""
  onChange={(e) => {
  if (!editor) return;

  editor
    .chain()
    .focus()
    .setFontFamily(e.target.value)
    .run();
}}
>
  <option value="" disabled>
    Font
  </option>
  <option value="Arial">Arial</option>
  <option value="Georgia">Georgia</option>
  <option value="Verdana">Verdana</option>
  <option value="Courier New">Courier</option>
  <option value="Poppins">Poppins</option>
</select>

    <select
  className="h-10 w-16 rounded-md border border-yellow-400 bg-black px-2 text-sm text-white"

  onChange={(e) => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .setFontSize(`${e.target.value}px`)
      .run();
  }}
>
    <option value="12">12</option>
  <option value="14">14</option>
  <option value="16">16</option>
  <option value="18">18</option>
  <option value="20">20</option>
  <option value="24">24</option>
  <option value="32">32</option>
</select>

      <Button
        onClick={() => {
          editor.chain().focus().toggleBold().run()
          console.log(editor.isActive("bold"));
        }}
        active={editor.isActive("bold")}
      >
        <Bold size={17} />
      </Button>

      <Button
        onClick={() => {
          editor.chain().focus().toggleItalic().run()
          console.log(editor.isActive("italic"));
        }}
        active={editor.isActive("italic")}
      >
        <Italic size={17} />
      </Button>

      <Button
        onClick={() => {
          editor.chain().focus().toggleUnderline().run()
          console.log(editor.isActive("underline"));
        }}
        active={editor.isActive("underline")}
      >
        <Underline size={17} />
      </Button>

      <Button
        onClick={() => {
          editor.chain().focus().toggleStrike().run()
          console.log(editor.isActive("strike"));
        }}
        active={editor.isActive("strike")}
      >
        <Strikethrough size={17} />
      </Button>


      <div className="w-px h-6 bg-yellow-300 mx-2" />

      <input
      type="color"
      title="Text Color"
      className="h-6 w-6 cursor-pointer "
      onChange={(e) => {
    editor
      .chain()
      .focus()
      .setColor(e.target.value)
      .run();
  }}
/>

    <Button
  onClick={() =>
    editor.chain().focus().toggleHighlight().run()
  }
  active={editor.isActive("highlight")}
>
  <Highlighter size={17} />
</Button>

      <Button
  onClick={() => {
    const url = prompt("Enter URL");

    if (!url) return;

    editor
      .chain()
      .focus()
      .setLink({ href: url })
      .run();
  }}

  active={editor.isActive("link")}
>
  <Link size={17} />
</Button>

      <Button
  onClick={() => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file = input.files?.[0];

      if (!file) return;

      const formData = new FormData();

formData.append("file", file);
formData.append(
  "upload_preset",
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
);

const res = await fetch(
  `https://api.cloudinary.com/v1_1/${
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }/image/upload`,  {
    method: "POST",
    body: formData,
  }
);

const data = await res.json();
console.log(data);
editor
  .chain()
  .focus()
  .setImage({
    src: data.secure_url,
  })
  .run();
    };

    input.click();
  }}
>
  <Image size={17} />
</Button>

      <div className="w-px h-6 bg-yellow-300 mx-2" />

      <Button
  onClick={() =>
    editor.chain().focus().undo().run()
  }
>
  <Undo2 size={17} />
</Button>

<Button
  onClick={() =>
    editor.chain().focus().redo().run()
  }
>
  <Redo2 size={17} />
</Button>

    </div>
  );
}