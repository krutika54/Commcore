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
import { cn } from "@/lib/utils";

interface TaskDetailModalProps {
  task: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PRIORITY_COLORS = {
  low: "bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.25)]",
  medium:
    "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 shadow-[0_0_8px_rgba(234,179,8,0.25)]",
  high: "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.3)]",
};

export const TaskDetailModal = ({
  task,
  open,
  onOpenChange,
}: TaskDetailModalProps) => {
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
      <DialogContent
        className={cn(
          "max-w-2xl max-h-[80vh] overflow-y-auto backdrop-blur-2xl rounded-xl",
          "bg-gradient-to-br from-[#0e0e10] via-[#15121c] to-[#1a1224]",
          "border border-white/10 shadow-[0_0_20px_rgba(139,92,246,0.25)]"
        )}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-white tracking-wide">
            {task.title}
            <Badge
              variant="outline"
              className={cn(
                "text-xs capitalize backdrop-blur-sm",
                PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS]
              )}
            >
              {task.priority}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 text-gray-200">
          {/* Task Details */}
          <div className="space-y-4">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium text-purple-300 mb-1">
                  Description
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {task.assignee && (
                <div className="flex items-center gap-2">
                  <Avatar className="size-6 ring-1 ring-purple-500/40">
                    <AvatarImage src={task.assignee.user?.image} />
                    <AvatarFallback className="text-xs bg-purple-500/10 text-purple-300">
                      {task.assignee.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-300">{task.assignee.user?.name}</span>
                </div>
              )}

              {task.dueDate && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="size-4 text-purple-400" />
                  <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-medium text-purple-300 mb-3">
              Comments
            </h4>

            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader className="size-5 animate-spin text-purple-400" />
              </div>
            ) : !comments || comments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No comments yet
              </p>
            ) : (
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start gap-3 bg-white/5 p-2 rounded-lg border border-white/10"
                  >
                    <Avatar className="size-6 ring-1 ring-purple-500/30">
                      <AvatarImage src={comment.member?.user?.image} />
                      <AvatarFallback className="text-xs bg-purple-500/10 text-purple-300">
                        {comment.member?.user?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-white">
                          {comment.member?.user?.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(comment.createdAt), "MMM dd, h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-gray-300 leading-snug">
                        {comment.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Form */}
            <form
              onSubmit={handleAddComment}
              className="flex gap-2 items-center"
            >
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={isPending}
                className="bg-white/5 border-white/10 text-gray-100 placeholder:text-gray-500 focus:border-purple-500/50"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isPending || !comment.trim()}
                className="bg-purple-600 hover:bg-purple-500 transition-all shadow-[0_0_10px_rgba(139,92,246,0.4)]"
              >
                <SendHorizontal className="size-4 text-white" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
