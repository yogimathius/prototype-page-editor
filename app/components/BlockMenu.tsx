import { useState } from "react";

export type BlockType = {
  id: string;
  type: string;
  icon: string;
  label: string;
  category: "text" | "media" | "layout" | "interactive" | "other";
};

const BLOCK_OPTIONS: BlockType[] = [
  // Text Blocks
  { id: "text", type: "text", icon: "📝", label: "Text", category: "text" },
  {
    id: "heading1",
    type: "heading1",
    icon: "H1",
    label: "Heading 1",
    category: "text",
  },
  {
    id: "heading2",
    type: "heading2",
    icon: "H2",
    label: "Heading 2",
    category: "text",
  },
  {
    id: "bulletList",
    type: "bulletList",
    icon: "•",
    label: "Bullet List",
    category: "text",
  },
  {
    id: "numberedList",
    type: "numberedList",
    icon: "1.",
    label: "Numbered List",
    category: "text",
  },
  { id: "quote", type: "quote", icon: '"', label: "Quote", category: "text" },
  {
    id: "code",
    type: "code",
    icon: "<>",
    label: "Code Block",
    category: "text",
  },

  // Media Blocks
  { id: "image", type: "image", icon: "🖼️", label: "Image", category: "media" },
  { id: "video", type: "video", icon: "🎥", label: "Video", category: "media" },
  { id: "embed", type: "embed", icon: "🔗", label: "Embed", category: "media" },
  {
    id: "gallery",
    type: "gallery",
    icon: "🖼️",
    label: "Gallery",
    category: "media",
  },

  // Layout Blocks
  {
    id: "columns",
    type: "columns",
    icon: "⫴",
    label: "Columns",
    category: "layout",
  },
  {
    id: "divider",
    type: "divider",
    icon: "—",
    label: "Divider",
    category: "layout",
  },
  {
    id: "spacer",
    type: "spacer",
    icon: "↕️",
    label: "Spacer",
    category: "layout",
  },

  // Interactive Blocks
  {
    id: "button",
    type: "button",
    icon: "🔘",
    label: "Button",
    category: "interactive",
  },
  {
    id: "form",
    type: "form",
    icon: "📋",
    label: "Form",
    category: "interactive",
  },
  {
    id: "table",
    type: "table",
    icon: "🗃️",
    label: "Table",
    category: "interactive",
  },
  {
    id: "tabs",
    type: "tabs",
    icon: "📑",
    label: "Tabs",
    category: "interactive",
  },

  // Other Blocks
  {
    id: "callout",
    type: "callout",
    icon: "💡",
    label: "Callout",
    category: "other",
  },
  {
    id: "codeSnippet",
    type: "codeSnippet",
    icon: "⌨️",
    label: "Code Snippet",
    category: "other",
  },
];

// Top 6 most commonly used blocks
const FEATURED_BLOCKS = BLOCK_OPTIONS.filter((block) =>
  ["text", "heading1", "image", "bulletList", "columns", "button"].includes(
    block.id
  )
);

export const BlockMenu = ({
  onSelect,
}: {
  onSelect: (blockType: BlockType) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlocks = BLOCK_OPTIONS.filter((block) =>
    block.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedBlocks = filteredBlocks.reduce(
    (acc, block) => {
      if (!acc[block.category]) {
        acc[block.category] = [];
      }
      acc[block.category].push(block);
      return acc;
    },
    {} as Record<string, BlockType[]>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium shadow-sm"
      >
        Add Block +
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          {/* Quick Access */}
          <div className="p-2 grid grid-cols-3 gap-1 border-b border-gray-700">
            {FEATURED_BLOCKS.map((block) => (
              <button
                key={block.id}
                onClick={() => {
                  onSelect(block);
                  setIsOpen(false);
                }}
                className="flex flex-col items-center p-2 rounded hover:bg-gray-700 text-gray-200"
              >
                <span className="text-xl mb-1">{block.icon}</span>
                <span className="text-xs">{block.label}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="p-2 border-b border-gray-700">
            <input
              type="text"
              placeholder="Search blocks..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categorized List */}
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(groupedBlocks).map(([category, blocks]) => (
              <div key={category} className="p-2">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">
                  {category}
                </div>
                {blocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => {
                      onSelect(block);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 hover:bg-gray-700 rounded-md text-gray-200 text-sm"
                  >
                    <span className="mr-2">{block.icon}</span>
                    {block.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
