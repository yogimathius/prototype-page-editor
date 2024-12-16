import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

interface BlockProps {
  content: any;
  onChange: (content: any) => void;
  type: string;
}

export const TipTapBlock: React.FC<BlockProps> = ({
  content,
  onChange,
  type,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Heading.configure({
        levels: [1, 2],
      }),
      Link.configure({
        openOnClick: true,
      }),
      TextStyle,
      Color,
      Underline,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[2rem] focus:outline-none",
      },
    },
  });

  const MenuBar = () => {
    if (!editor) return null;

    const getToolbarItems = () => {
      // Default text formatting options for paragraphs
      const textFormatting = [
        {
          icon: "B",
          label: "Bold",
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: () => editor.isActive("bold"),
        },
        {
          icon: "I",
          label: "Italic",
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: () => editor.isActive("italic"),
        },
        {
          icon: "‾",
          label: "Underline",
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: () => editor.isActive("underline"),
        },
        {
          icon: "~",
          label: "Strike",
          action: () => editor.chain().focus().toggleStrike().run(),
          isActive: () => editor.isActive("strike"),
        },
        {
          icon: "<>",
          label: "Code",
          action: () => editor.chain().focus().toggleCode().run(),
          isActive: () => editor.isActive("code"),
        },
        {
          icon: "•",
          label: "Bullet List",
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: () => editor.isActive("bulletList"),
        },
        {
          icon: "1.",
          label: "Numbered List",
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: () => editor.isActive("orderedList"),
        },
        {
          icon: "↩",
          label: "Link",
          action: () => {
            const url = window.prompt("Enter URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          },
          isActive: () => editor.isActive("link"),
        },
      ];

      switch (type) {
        case "heading1":
          return [
            <button
              key="h1"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
                ${
                  editor.isActive("heading", { level: 1 })
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
            >
              H1
            </button>,
          ];
        case "heading2":
          return [
            <button
              key="h2"
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
                ${
                  editor.isActive("heading", { level: 2 })
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
            >
              H2
            </button>,
          ];
        case "bulletList":
          return [
            <button
              key="bullet"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
                ${
                  editor.isActive("bulletList")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
            >
              Bullet List
            </button>,
          ];
        case "image":
          return [
            <button
              key="image"
              onClick={() => {
                const url = window.prompt("Enter image URL");
                if (url) {
                  editor.chain().focus().setImage({ src: url }).run();
                }
              }}
              className="px-3 py-1.5 rounded text-sm font-medium bg-gray-700 text-gray-200 hover:bg-gray-600"
            >
              Add Image
            </button>,
          ];
        default:
          // Return text formatting toolbar for paragraphs
          return textFormatting.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
                ${
                  item.isActive()
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              title={item.label}
            >
              {item.icon}
            </button>
          ));
      }
    };

    return (
      <div className="flex gap-2 p-2 bg-gray-800 rounded-t-lg border-b border-gray-700">
        {getToolbarItems()}
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 w-full">
      <MenuBar />
      <div className="p-4">
        <EditorContent
          editor={editor}
          className="prose prose-invert max-w-none"
        />
      </div>
    </div>
  );
};
