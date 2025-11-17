"use client";

import { useParams } from "next/navigation";
import { TaskRoomHeader } from "@/features/tasks/components/task-room-header";
import { TaskRoomTabs } from "@/features/tasks/components/task-room-tabs";
import { Id } from "../../../../../../convex/_generated/dataModel";

const TaskRoomPage = () => {
  const params = useParams();
  const taskId = params.taskId as Id<"tasks">;

  return (
    <div className="h-full flex flex-col">
      <TaskRoomHeader taskId={taskId} />
      <TaskRoomTabs taskId={taskId} />
    </div>
  );
};

export default TaskRoomPage;
