"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader, SendHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useAddTaskComment } from "../api/use-add-task-comment";
import { toast } from "sonner";
import { format } from "date-fns";
import { useGetTaskComments } from "../api/use-get-task-comments";

interface TaskDiscussionProps {
  taskId: Id<"tasks">;
}

export const TaskDiscussion = ({ taskId }: TaskDiscussionProps) => {
  const { data: comments, isLoading } = useGetTaskComments({ taskId });
  const { mutate: addComment, isPending } = useAddTaskComment();
  const [comment, setComment] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when comments change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    addComment(
      {
        taskId,
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
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No comments yet. Start the discussion!</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <div key={comment._id} className="flex items-start gap-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={comment.member?.user?.image} />
                  <AvatarFallback className="text-xs">
                    {comment.member?.user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold truncate">
                      {comment.member?.user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), "MMM dd, h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm mt-1 break-words">{comment.body}</p>
                </div>
              </div>
            ))}
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <form onSubmit={handleAddComment} className="flex gap-2">
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={isPending}
            className="flex-1"
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
  );
};
