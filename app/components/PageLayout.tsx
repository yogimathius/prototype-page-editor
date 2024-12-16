import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { DraggableBlock } from "./DraggableBlock";
import { TipTapBlock } from "./blocks";
import { BlockMenu, BlockType } from "./BlockMenu";

export interface Block {
  id: string;
  type: string;
  content: string;
  order: number;
  pageId?: string;
}

interface PageLayoutProps {
  initialBlocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
}

export const PageLayout = ({
  initialBlocks = [],
  onBlocksChange,
}: PageLayoutProps) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Notify parent of changes
  useEffect(() => {
    onBlocksChange(blocks);
  }, [blocks, onBlocksChange]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);
        const newBlocks = arrayMove(blocks, oldIndex, newIndex);
        // Update order values
        return newBlocks.map((block, index) => ({
          ...block,
          order: index,
        }));
      });
    }
  };

  const handleBlockSelect = (blockType: BlockType) => {
    const newBlock: Block = {
      id: `${Date.now()}`,
      type: blockType.type,
      content: "",
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-900 min-h-screen">
      <div className="mb-4">
        <BlockMenu onSelect={handleBlockSelect} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {blocks.map((block) => (
              <DraggableBlock key={block.id} id={block.id}>
                <TipTapBlock
                  type={block.type}
                  content={block.content}
                  onChange={(content) => {
                    setBlocks(
                      blocks.map((b) =>
                        b.id === block.id ? { ...b, content } : b
                      )
                    );
                  }}
                />
              </DraggableBlock>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
