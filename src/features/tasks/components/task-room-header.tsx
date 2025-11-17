"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Trash, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useQuery } from "convex/react";
// import { api } from "../../../../../convex/_generated/api";
// import { Id } from "../../../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
// import { EditTaskModal } from "./edit-task-modal";
// import { DeleteTaskModal } from "./delete-task-modal";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { EditTaskModal } from "./edit-task-modal";
import { DeleteTaskModal } from "./delete-task-modal";

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
    return <div className="h-16 border-b flex items-center px-4">Loading...</div>;
  }

  return (
    <>
      <div className="h-auto border-b px-4 py-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Button
              onClick={() => router.push(`/workspace/${workspaceId}/tasks`)}
              variant="ghost"
              size="icon"
              className="shrink-0"
            >
              <ArrowLeft className="size-5" />
            </Button>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-bold">{task.title}</h1>
                <Badge
                  variant="outline"
                  className={cn("text-xs", PRIORITY_COLORS[task.priority])}
                >
                  {task.priority}
                </Badge>
              </div>

              {task.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {task.assignee && (
                  <div className="flex items-center gap-2">
                    <User className="size-4" />
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
                    <Calendar className="size-4" />
                    <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowEditModal(true)}
              variant="outline"
              size="sm"
            >
              <Edit className="size-4 mr-2" />
              Edit
            </Button>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="outline"
              size="sm"
            >
              <Trash className="size-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

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
