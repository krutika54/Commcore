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
  low: "bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
  medium:
    "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
  high: "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.25)]",
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
        status: newStatus as
          | "not_started"
          | "in_progress"
          | "completed"
          | "delayed",
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
    <Card
      className={cn(
        "group relative transition-all border border-white/10 bg-gradient-to-br from-[#0e0e10] via-[#141218] to-[#1a1325]",
        "hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:border-purple-500/40 hover:scale-[1.02]",
        "backdrop-blur-xl rounded-xl overflow-hidden"
      )}
    >
      {/* subtle glow ring */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 bg-gradient-to-tr from-purple-500 via-violet-600 to-cyan-500 blur-3xl transition-opacity"></div>

      <CardHeader className="relative p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-sm text-white tracking-wide leading-snug flex-1">
            {task.title}
          </h4>
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium capitalize backdrop-blur-md",
              PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]
            )}
          >
            {task.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative p-4 pt-0 space-y-3">
        {task.description && (
          <p className="text-xs text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* STATUS DROPDOWN */}
        <div className="pt-2">
          <Select
            value={task.status}
            onValueChange={handleStatusChange}
            disabled={isPending}
          >
            <SelectTrigger className="h-8 text-xs bg-white/5 border-white/10 text-gray-200 hover:border-purple-400/40 focus:ring-purple-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1b1522]/95 backdrop-blur-md text-gray-200 border border-purple-500/30 shadow-lg">
              {STATUS_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-purple-500/20 focus:bg-purple-500/30"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
            <Calendar className="size-3 text-purple-400" />
            <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
          </div>
        )}

        {/* Assignee */}
        {task.assignee ? (
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <Avatar className="size-5 ring-1 ring-purple-500/40">
              <AvatarImage src={task.assignee.user?.image} />
              <AvatarFallback className="text-xs text-gray-300 bg-purple-500/10">
                {task.assignee.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-300 truncate">
              {task.assignee.user?.name || "Unassigned"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-gray-400">
            <User className="size-4 text-purple-400" />
            <span className="text-xs">Unassigned</span>
          </div>
        )}

        {/* Open Task Button */}
        <Button
          onClick={handleOpenTask}
          variant="outline"
          size="sm"
          className="w-full mt-2 border-purple-500/40 text-purple-300 hover:bg-purple-500/20 hover:text-purple-100 transition-colors"
        >
          <MessageSquare className="size-4 mr-2 text-purple-300" />
          Open Task Room
        </Button>
      </CardContent>
    </Card>
  );
};
