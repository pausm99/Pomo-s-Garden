"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import TodoState from "./TodoState";
import Task from "@/interfaces/Task";
import TaskComponent from "./Task";

type TaskState = {
  todo: Task[];
  doing: Task[];
  done: Task[];
};

const initialTasks: TaskState = {
  todo: [
    {
      id: 1,
      title: "Revisar el informe trimestral",
      description:
        "Revisar y corregir errores en el informe financiero del tercer trimestre.",
      tags: [
        { label: "Finanzas", color: "#FEE2E2" },
        { label: "Urgente", color: "#FEE2E2" },
      ],
    },
    {
      id: 4,
      title: "Leer artículo sobre inteligencia artificial",
      description:
        "Explorar nuevas tendencias en IA y su aplicación en nuestro proyecto.",
      tags: [{ label: "Investigación", color: "#EDE9FE" }],
    },
    {
      id: 5,
      title: "Organizar evento de networking",
      description:
        "Coordinar los detalles del evento y confirmar la asistencia de los invitados.",
      tags: [{ label: "Eventos", color: "#FAFAFA" }],
    },
  ],
  doing: [
    {
      id: 2,
      title: "Reunión con el equipo de desarrollo",
      description: "Planificar las tareas para el próximo sprint.",
      tags: [{ label: "Desarrollo", color: "#ECFCCB" }],
    },
  ],
  done: [
    {
      id: 3,
      title: "Actualizar el blog",
      tags: [{ label: "Marketing", color: "#DBEAFE" }],
    },
  ],
};

export default function TaskSection() {
  const [tasks, setTasks] = useState<TaskState>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id as number;
    const [section] = getTaskIndex(activeId);
    if (section) {
      const task = tasks[section].find((task) => task.id === activeId) || null;
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active) return;

    const activeId = active.id as number;
    const overId = over.id as number | undefined;

    // Get the initial position of the task
    const [activeSection, activeIndex] = getTaskIndex(activeId);
    const [overSection, overIndex] = getTaskIndex(overId ?? -1);

    if (activeSection && overSection) {
      const updatedTasks = { ...tasks };

      // Remove from the current position
      const [movedTask] = updatedTasks[activeSection].splice(activeIndex, 1);

      // Determine the target index
      let targetIndex: number;

      if (overId === undefined) {
        // Dropped in the section, not on a specific task
        targetIndex = updatedTasks[overSection].length;
      } else {
        // Dropped between tasks
        targetIndex =
          overIndex === -1 ? updatedTasks[overSection].length : overIndex;
      }

      // Insert into the new position
      updatedTasks[overSection].splice(targetIndex, 0, movedTask);

      setTasks(updatedTasks);
      setActiveTask(null);
    }
  };

  const getTaskIndex = (taskId: number): [keyof TaskState | null, number] => {
    for (const section in tasks) {
      const index = tasks[section as keyof TaskState].findIndex(
        (task) => task.id === taskId
      );
      if (index > -1) {
        return [section as keyof TaskState, index];
      }
    }
    return [null, -1];
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-5 h-full flex gap-5 overflow-hidden">
        <div className="flex-1 w-[33%] flex flex-col gap-2.5 bg-[#f4f4f5cc]">
          <SortableContext items={tasks.todo.map((task) => task.id)}>
            <TodoState state="todo" name="To do" tasks={tasks.todo} />
          </SortableContext>
        </div>
        <div className="flex-1 w-[33%] flex flex-col gap-2.5 bg-[#f4f4f5cc]">
          <SortableContext items={tasks.doing.map((task) => task.id)}>
            <TodoState state="doing" name="Doing" tasks={tasks.doing} />
          </SortableContext>
        </div>
        <div className="flex-1 w-[33%] flex flex-col gap-2.5 bg-[#f4f4f5cc]">
          <SortableContext items={tasks.done.map((task) => task.id)}>
            <TodoState state="done" name="Done" tasks={tasks.done} />
          </SortableContext>
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskComponent key={activeTask.id} task={activeTask} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
