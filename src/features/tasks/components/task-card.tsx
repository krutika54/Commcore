"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateTaskStatus } from "../api/use-update-task-status";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface TaskCardProps {
  task: any;
}

const PRIORITY_COLORS = {
  low: "bg-green-500/10 text-green-700 border-green-200",
  medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  high: "bg-red-500/10 text-red-700 border-red-200",
};

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "delayed", label: "Delayed" },
];

export const TaskCard = ({ task }: TaskCardProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate: updateStatus, isPending } = useUpdateTaskStatus();

  const handleStatusChange = (newStatus: string) => {
    updateStatus(
      {
        taskId: task._id,
        status: newStatus as "not_started" | "in_progress" | "completed" | "delayed",
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "completed"
              ? "Task completed and moved to history"
              : "Task status updated"
          );
        },
        onError: () => {
          toast.error("Failed to update task");
        },
      }
    );
  };

  const handleOpenTask = () => {
    router.push(`/workspace/${workspaceId}/tasks/${task._id}`);
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-sm line-clamp-2 flex-1">
            {task.title}
          </h4>
          <Badge
            variant="outline"
            className={cn("text-xs", PRIORITY_COLORS[task.priority])}
          >
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* STATUS DROPDOWN */}
        <Select
          value={task.status}
          onValueChange={handleStatusChange}
          disabled={isPending}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
          </div>
        )}

        {/* ASSIGNEE DISPLAY */}
        {task.assignee ? (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Avatar className="size-5">
              <AvatarImage src={task.assignee.user?.image} />
              <AvatarFallback className="text-xs">
                {task.assignee.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {task.assignee.user?.name || "Unassigned"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-2 border-t text-muted-foreground">
            <User className="size-4" />
            <span className="text-xs">Unassigned</span>
          </div>
        )}

        {/* OPEN TASK BUTTON */}
        <Button
          onClick={handleOpenTask}
          variant="outline"
          size="sm"
          className="w-full mt-2"
        >
          <MessageSquare className="size-4 mr-2" />
          Open Task Room
        </Button>
      </CardContent>
    </Card>
  );
};
