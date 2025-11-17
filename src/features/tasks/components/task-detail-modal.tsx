"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetTaskComments } from "../api/use-get-task-comments";
import { useAddTaskComment } from "../api/use-add-task-comment";
import { Loader, SendHorizontal, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

interface TaskDetailModalProps {
  task: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRIORITY_COLORS = {
  low: "bg-green-500/10 text-green-700 border-green-200",
  medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  high: "bg-red-500/10 text-red-700 border-red-200",
};

export const TaskDetailModal = ({ task, open, onOpenChange }: TaskDetailModalProps) => {
  const { data: comments, isLoading } = useGetTaskComments({ taskId: task._id });
  const { mutate: addComment, isPending } = useAddTaskComment();
  const [comment, setComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    addComment(
      {
        taskId: task._id,
        body: comment.trim(),
      },
      {
        onSuccess: () => {
          setComment("");
          toast.success("Comment added");
        },
        onError: () => {
          toast.error("Failed to add comment");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.title}
            <Badge
              variant="outline"
              className={cn("text-xs", PRIORITY_COLORS[task.priority])}
            >
              {task.priority}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Details */}
          <div className="space-y-3">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              {task.assignee && (
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <Avatar className="size-6">
                    <AvatarImage src={task.assignee.user?.image} />
                    <AvatarFallback className="text-xs">
                      {task.assignee.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignee.user?.name}</span>
                </div>
              )}

              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Comments</h4>

            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : !comments || comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet
              </p>
            ) : (
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex items-start gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={comment.member?.user?.image} />
                      <AvatarFallback className="text-xs">
                        {comment.member?.user?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium">
                          {comment.member?.user?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.createdAt), "MMM dd, h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm mt-0.5">{comment.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={isPending}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isPending || !comment.trim()}
              >
                <SendHorizontal className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
