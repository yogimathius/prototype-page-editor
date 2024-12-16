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
import { useState } from "react";
import { DraggableBlock } from "./DraggableBlock";
import { TipTapBlock } from "./blocks";
import { BlockMenu, BlockType } from "./BlockMenu";

export const PageLayout = () => {
  const [blocks, setBlocks] = useState<
    Array<{ id: string; type: string; content: string }>
  >([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);
        return arrayMove(blocks, oldIndex, newIndex);
      });
    }
  };

  const handleBlockSelect = (blockType: BlockType) => {
    setBlocks([
      ...blocks,
      {
        id: `${Date.now()}`,
        type: blockType.type,
        content: "",
      },
    ]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(
      blocks.map((block) => (block.id === id ? { ...block, content } : block))
    );
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
                  onChange={(content) => updateBlock(block.id, content)}
                />
              </DraggableBlock>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
