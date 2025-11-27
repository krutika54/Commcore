"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Trash, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { EditTaskModal } from "./edit-task-modal";
import { DeleteTaskModal } from "./delete-task-modal";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TaskRoomHeaderProps {
  taskId: Id<"tasks">;
}

const PRIORITY_COLORS = {
  low: "bg-green-500/10 text-green-700 border-green-200",
  medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  high: "bg-red-500/10 text-red-700 border-red-200",
};

export const TaskRoomHeader = ({ taskId }: TaskRoomHeaderProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const task = useQuery(api.tasks.getById, { taskId });

  if (!task) {
    return (
      <div className="h-16 border-b flex items-center justify-center text-muted-foreground">
        Loading task details...
      </div>
    );
  }

  return (
    <>
      <div className="border-b bg-white/80 backdrop-blur-md shadow-sm transition-all">
        <div className="px-6 py-4 flex items-start justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-start gap-3 flex-1">
            <Button
              onClick={() => router.push(`/workspace/${workspaceId}/tasks`)}
              variant="ghost"
              size="icon"
              className="shrink-0 hover:bg-muted transition-colors"
            >
              <ArrowLeft className="size-5" />
            </Button>

            <div className="flex-1 space-y-1">
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-lg font-semibold">{task.title}</h1>
                <Badge
                  variant="outline"
                  className={cn("text-xs px-2 py-0.5", PRIORITY_COLORS[task.priority])}
                >
                  {task.priority.toUpperCase()}
                </Badge>
              </div>

              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                {task.assignee && (
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <Avatar className="size-5">
                      <AvatarImage src={task.assignee.user?.image} />
                      <AvatarFallback className="text-xs">
                        {task.assignee.user?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{task.assignee.user?.name}</span>
                  </div>
                )}

                {task.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setShowEditModal(true)}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="size-4" />
              Edit
            </Button>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash className="size-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditTaskModal
        task={task}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />

      <DeleteTaskModal
        taskId={taskId}
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
      />
    </>
  );
};
