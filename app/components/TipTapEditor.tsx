import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      label: "H1",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        editor.chain().focus().toggleHeading({ level: 1 }).run();
      },
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      label: "H2",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        editor.chain().focus().toggleHeading({ level: 2 }).run();
      },
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      label: "Bold",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        editor.chain().focus().toggleBold().run();
      },
      isActive: () => editor.isActive("bold"),
    },
    {
      label: "Bullet List",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        editor.chain().focus().toggleBulletList().run();
      },
      isActive: () => editor.isActive("bulletList"),
    },
  ];

  return (
    <div
      className="flex gap-2 p-2 bg-gray-800 rounded-t-lg border-b border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >
      {buttons.map((button) => (
        <button
          key={button.label}
          onClick={button.onClick}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
            ${
              button.isActive()
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
        >
          {button.label}
        </button>
      ))}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const url = window.prompt("Enter image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        className="px-3 py-1.5 rounded text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50"
      >
        Image
      </button>
    </div>
  );
};

export const TipTapEditor = ({
  content,
  onUpdate,
}: {
  content?: string;
  onUpdate?: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: content || "<p>Start typing...</p>",
    onUpdate: ({ editor }) => {
      setTimeout(() => {
        onUpdate?.(editor.getHTML());
      }, 0);
    },
  });

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-lg border border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none p-4 min-h-[200px] text-gray-200"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
