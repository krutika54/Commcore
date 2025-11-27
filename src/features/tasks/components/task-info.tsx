"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskInfoProps {
  taskId: Id<"tasks">;
  showCompleted?: boolean;
}

const PRIORITY_COLORS = {
  low: "bg-green-500/10 text-green-700 border-green-200",
  medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  high: "bg-red-500/10 text-red-700 border-red-200",
};

const STATUS_COLORS = {
  not_started: "bg-slate-500/10 text-slate-700 border-slate-200",
  in_progress: "bg-blue-500/10 text-blue-700 border-blue-200",
  completed: "bg-green-500/10 text-green-700 border-green-200",
  delayed: "bg-red-500/10 text-red-700 border-red-200",
};

export const TaskInfo = ({ taskId, showCompleted = false }: TaskInfoProps) => {
  const task = useQuery(api.tasks.getById, { taskId });

  if (!task) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Hide completed tasks only when showCompleted = false
  if (!showCompleted && task.status === "completed") {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>This task has been completed.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <Badge
          variant="outline"
          className={cn("text-sm", STATUS_COLORS[task.status])}
        >
          {task.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground">{task.description}</p>
      )}

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Priority</h3>
        <Badge
          variant="outline"
          className={cn("text-sm", PRIORITY_COLORS[task.priority])}
        >
          {task.priority.toUpperCase()}
        </Badge>
      </div>

      {task.assignee && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Assigned To
          </h3>
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={task.assignee.user?.image} />
              <AvatarFallback>
                {task.assignee.user?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{task.assignee.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {task.assignee.user?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {task.creator && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Created By</h3>
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={task.creator?.user?.image} />
              <AvatarFallback>
                {task.creator?.user?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{task.creator?.user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(task.createdAt), "MMM dd, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
        </div>
      )}

      {task.dueDate && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Calendar className="size-4" /> Due Date
          </h3>
          <p className="text-sm">{format(new Date(task.dueDate), "MMMM dd, yyyy")}</p>
        </div>
      )}

      {task.completedAt && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-600" /> Completed At
          </h3>
          <p className="text-sm text-green-700">
            {format(new Date(task.completedAt), "MMMM dd, yyyy 'at' h:mm a")}
          </p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <Clock className="size-4" /> Last Updated
        </h3>
        <p className="text-sm">
          {format(new Date(task.updatedAt), "MMMM dd, yyyy 'at' h:mm a")}
        </p>
      </div>
    </div>
  );
};
