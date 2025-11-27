"use client";

import { useGetRoomMessages } from "../api/use-get-room-messages";
import { useSendRoomMessage } from "../api/use-send-room-message";
import { Loader, SendHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";

interface RoomChatProps {
  roomId: Id<"discussionRooms">;
}

export const RoomChat = ({ roomId }: RoomChatProps) => {
  const { data: messages, isLoading } = useGetRoomMessages({ roomId });
  const { mutate: sendMessage, isPending } = useSendRoomMessage();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    sendMessage(
      {
        roomId,
        body: message.trim(),
      },
      {
        onSuccess: () => {
          setMessage("");
        },
        onError: () => {
          toast.error("Failed to send message");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <Loader className="size-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {!messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(56,189,248,0.3)] mx-auto">
                <SendHorizontal className="size-8 text-cyan-400" />
              </div>
              <p className="text-gray-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-600/5 hover:via-blue-600/5 hover:to-cyan-600/5 transition-all duration-300 group"
              >
                <Avatar className="size-8 ring-1 ring-white/20 group-hover:ring-cyan-400/50 transition-all">
                  <AvatarImage src={msg.member?.user?.image} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs">
                    {msg.member?.user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm text-white">
                      {msg.member?.user?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(msg.createdAt), "h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-gray-300">{msg.body}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-cyan-600/5 backdrop-blur-md">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isPending}
            className="bg-black/30 border-white/10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending || !message.trim()}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white border-0 shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
          >
            <SendHorizontal className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};