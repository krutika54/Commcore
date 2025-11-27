"use client";

import { useParams } from "next/navigation";
import { TaskRoomHeader } from "@/features/tasks/components/task-room-header";
import { TaskRoomTabs } from "@/features/tasks/components/task-room-tabs";
import { Id } from "../../../../../../convex/_generated/dataModel";

const TaskRoomPage = () => {
  const params = useParams();
  const taskId = params.taskId as Id<"tasks">;

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] text-gray-200">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm z-10">
        <TaskRoomHeader taskId={taskId} />
      </div>

      {/* Tabs / Content Section */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full bg-black/30 backdrop-blur-md border-t border-white/10">
          <TaskRoomTabs taskId={taskId} />
        </div>
      </div>
    </div>
  );
};

export default TaskRoomPage;
