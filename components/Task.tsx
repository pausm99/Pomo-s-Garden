import TaskType from "@/interfaces/Task";
import { EllipsisVertical } from "lucide-react";
import { TagManager } from "./TagManager";
import Tag from "./atoms/Tag";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskProps = {
  task: TaskType;
};

export default function Task({ task }: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
    opacity: isDragging ? 0.5 : 1,
    height: "175px",
    boxSizing: "border-box" as "border-box",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex flex-col gap-5 p-4 bg-white text-black rounded-lg"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-zinc-700 text-base font-semibold">{task.title}</h3>
        <EllipsisVertical size={16} cursor="pointer" color="#a1a1aa" />
      </div>
      {task.description && (
        <p className="text-zinc-500 text-sm">{task.description}</p>
      )}
      <div className="flex gap-2 flex-wrap items-center">
        {task.tags &&
          task.tags.map((tag, index) => (
            <span key={index}>
              <Tag tag={tag} />
            </span>
          ))}
        <TagManager />
      </div>
    </div>
  );
}
