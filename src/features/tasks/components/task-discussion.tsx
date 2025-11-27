"use client";

import { useState, useEffect, useRef } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader, SendHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddTaskComment } from "../api/use-add-task-comment";
import { useGetTaskComments } from "../api/use-get-task-comments";
import { toast } from "sonner";
import { format } from "date-fns";

interface TaskDiscussionProps {
  taskId: Id<"tasks">;
}

export const TaskDiscussion = ({ taskId }: TaskDiscussionProps) => {
  const { data: comments, isLoading } = useGetTaskComments({ taskId });
  const { mutate: addComment, isPending } = useAddTaskComment();
  const [comment, setComment] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addComment(
      { taskId, body: comment.trim() },
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
    <div
      className="flex flex-col h-full bg-gradient-to-br from-[#0e0e10] via-[#15121c] to-[#1a1224]
      border border-white/10 rounded-xl backdrop-blur-2xl shadow-[0_0_20px_rgba(139,92,246,0.2)]"
    >
      {/* Comments Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-purple-600/40 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader className="size-6 animate-spin text-purple-400" />
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No comments yet. Start the discussion!</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start gap-3 group hover:bg-white/5 transition-all rounded-lg p-2"
              >
                <Avatar className="size-8 ring-1 ring-purple-500/40 shrink-0">
                  <AvatarImage src={comment.member?.user?.image} />
                  <AvatarFallback className="text-xs bg-purple-500/10 text-purple-300">
                    {comment.member?.user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-white">
                      {comment.member?.user?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(comment.createdAt), "MMM dd, h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-gray-300 leading-snug break-words">
                    {comment.body}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Comment Input */}
      <div className="border-t border-white/10 p-4 bg-black/20 backdrop-blur-md">
        <form
          onSubmit={handleAddComment}
          className="flex gap-2 items-center"
        >
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            disabled={isPending}
            className="flex-1 bg-white/5 border-white/10 text-gray-100 placeholder:text-gray-500 focus:border-purple-500/50"
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
  );
};
