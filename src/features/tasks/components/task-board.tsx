"use client";

import { useGetActiveTasks } from "../api/use-get-active-tasks";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Plus, Loader, History } from "lucide-react";
import { TaskCard } from "./task-card";
import { useCreateTaskModal } from "../store/use-create-task-modal";
import { useState } from "react";
import { TaskHistoryModal } from "./task-history-modal";

type TaskStatus = "not_started" | "in_progress" | "completed" | "delayed";

const STATUS_CONFIG = {
  not_started: { label: "Not Started", color: "from-gray-800 via-gray-900 to-black" },
  in_progress: { label: "In Progress", color: "from-blue-700 via-blue-800 to-black" },
  completed: { label: "Completed", color: "from-green-700 via-emerald-800 to-black" },
  delayed: { label: "Delayed", color: "from-red-700 via-pink-800 to-black" },
};

export const TaskBoard = () => {
  const workspaceId = useWorkspaceId();
  const { data: tasks, isLoading } = useGetActiveTasks({ workspaceId });
  const [_open, setOpen] = useCreateTaskModal();
  const [showHistory, setShowHistory] = useState(false);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks?.filter((task) => task.status === status) || [];
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <Loader className="size-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 backdrop-blur-md bg-white/5">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-wide drop-shadow-lg">
              Task Management
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Track and manage team tasks efficiently
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowHistory(true)}
              size="sm"
              variant="outline"
              className="
                border border-purple-500/40 text-purple-300 
                hover:bg-purple-600/20 hover:text-white 
                transition-all duration-300
              "
            >
              <History className="size-4 mr-2 text-purple-400" />
              History
            </Button>
            <Button
              onClick={() => setOpen(true)}
              size="sm"
              className="
                bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 
                text-white font-semibold 
                hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] 
                transition-all duration-300
              "
            >
              <Plus className="size-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Task Columns */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((status) => {
              const statusTasks = getTasksByStatus(status);
              return (
                <div
                  key={status}
                  className="
                    flex flex-col rounded-xl 
                    border border-white/10 
                    backdrop-blur-md 
                    bg-white/5 
                    shadow-[0_0_20px_-5px_rgba(147,51,234,0.2)]
                    hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.4)]
                    transition-all duration-300
                  "
                >
                  {/* Status Header */}
                  <div
                    className={`
                      bg-gradient-to-r ${STATUS_CONFIG[status].color}
                      p-3 rounded-t-xl border-b border-white/10
                    `}
                  >
                    <h3 className="font-semibold text-sm flex items-center justify-between text-white">
                      {STATUS_CONFIG[status].label}
                      <span className="text-xs bg-black/40 px-2 py-0.5 rounded-full text-cyan-300">
                        {statusTasks.length}
                      </span>
                    </h3>
                  </div>

                  {/* Task Cards */}
                  <div className="flex-1 p-3 rounded-b-xl space-y-3 min-h-[400px] overflow-y-auto">
                    {statusTasks.length > 0 ? (
                      statusTasks.map((task) => (
                        <TaskCard key={task._id} task={task} />
                      ))
                    ) : (
                      <div className="text-center text-gray-500 text-sm pt-10">
                        No tasks yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <TaskHistoryModal open={showHistory} onOpenChange={setShowHistory} />
    </>
  );
};
