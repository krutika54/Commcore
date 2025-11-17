"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetTaskHistory } from "../api/use-get-task-history";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TaskHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskHistoryModal = ({ open, onOpenChange }: TaskHistoryModalProps) => {
  const workspaceId = useWorkspaceId();
  const { data: tasks, isLoading } = useGetTaskHistory({ workspaceId });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Completed Tasks History</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : !tasks || tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No completed tasks yet
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3">
                      {task.assignee && (
                        <div className="flex items-center gap-1.5">
                          <Avatar className="size-5">
                            <AvatarImage src={task.assignee.user?.image} />
                            <AvatarFallback className="text-xs">
                              {task.assignee.user?.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {task.assignee.user?.name}
                          </span>
                        </div>
                      )}
                      {task.completedAt && (
                        <span className="text-xs text-muted-foreground">
                          Completed: {format(new Date(task.completedAt), "MMM dd, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700">
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
