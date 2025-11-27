"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetTaskHistory } from "../api/use-get-task-history";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRIORITY_COLORS = {
  low: "bg-green-500/10 text-green-400 border-green-400/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
  high: "bg-red-500/10 text-red-400 border-red-400/20",
};

export const TaskHistoryModal = ({
  open,
  onOpenChange,
}: TaskHistoryModalProps) => {
  const workspaceId = useWorkspaceId();
  const { data: tasks, isLoading } = useGetTaskHistory({ workspaceId });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[80vh] overflow-y-auto 
        bg-gradient-to-br from-[#0e0e10] via-[#15121c] to-[#1a1224]
        border border-white/10 backdrop-blur-2xl 
        shadow-[0_0_25px_rgba(139,92,246,0.3)] text-gray-100"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-white">
            <CheckCircle2 className="size-5 text-green-400" />
            Completed Tasks History
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="size-6 animate-spin text-purple-400" />
          </div>
        ) : !tasks || tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No completed tasks yet
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="p-4 rounded-xl border border-white/10 
                bg-white/5 hover:bg-purple-500/5 
                transition-all duration-200 shadow-sm hover:shadow-[0_0_10px_rgba(139,92,246,0.2)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium text-white text-base">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-sm text-gray-400 leading-snug">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center flex-wrap gap-3 pt-2">
                      {task.assignee && (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6 ring-1 ring-purple-400/30">
                            <AvatarImage src={task.assignee.user?.image} />
                            <AvatarFallback className="text-xs bg-purple-500/10 text-purple-300">
                              {task.assignee.user?.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-300">
                            {task.assignee.user?.name}
                          </span>
                        </div>
                      )}
                      {task.completedAt && (
                        <span className="text-xs text-gray-400">
                          Completed:{" "}
                          <span className="text-gray-300">
                            {format(new Date(task.completedAt), "MMM dd, yyyy")}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs capitalize border px-2 py-0.5",
                      PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]
                    )}
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
