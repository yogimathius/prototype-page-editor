import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const DraggableBlock = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-4 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center w-8 h-8 bg-gray-100 rounded cursor-move"
      >
        ⋮⋮
      </div>
      {children}
    </div>
  );
};
