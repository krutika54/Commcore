"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader, Calendar, User, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskInfoProps {
  taskId: Id<"tasks">;
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

export const TaskInfo = ({ taskId }: TaskInfoProps) => {
  const task = useQuery(api.tasks.getById, { taskId });

  if (!task) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Status</h3>
        <Badge
          variant="outline"
          className={cn("text-sm", STATUS_COLORS[task.status])}
        >
          {task.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Priority</h3>
        <Badge
          variant="outline"
          className={cn("text-sm", PRIORITY_COLORS[task.priority])}
        >
          {task.priority.toUpperCase()}
        </Badge>
      </div>

      {task.assignee && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
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

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Created By
        </h3>
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

      {task.dueDate && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Calendar className="size-4" />
            Due Date
          </h3>
          <p className="text-sm">
            {format(new Date(task.dueDate), "MMMM dd, yyyy")}
          </p>
        </div>
      )}

      {task.completedAt && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            Completed At
          </h3>
          <p className="text-sm">
            {format(new Date(task.completedAt), "MMMM dd, yyyy 'at' h:mm a")}
          </p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Clock className="size-4" />
          Last Updated
        </h3>
        <p className="text-sm">
          {format(new Date(task.updatedAt), "MMMM dd, yyyy 'at' h:mm a")}
        </p>
      </div>
    </div>
  );
};
