"use client";

import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/message-list";
import { usePanel } from "@/hooks/use-panel";
import { cn } from "@/lib/utils";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
  const { onOpenProfile } = usePanel();

  const { data: member, isLoading: memberLoading } = useGetMember({ id: memberId });
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <Loader className="size-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      {/* Top Header */}
      <div className="border-b border-gray-800 bg-gray-900/70 backdrop-blur-md">
        <Header
          memberName={member?.user.name}
          memberImage={member?.user.image}
          onClick={() => onOpenProfile(memberId)}
        />
      </div>

      {/* Message List */}
      <div
        className={cn(
          "flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gradient-to-b from-gray-900/60 to-gray-950/90"
        )}
      >
        <MessageList
          data={results}
          variant="conversation"
          memberImage={member?.user.image}
          memberName={member?.user.name}
          loadMore={loadMore}
          isLoadingMore={status === "LoadingMore"}
          canLoadMore={status === "CanLoadMore"}
        />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-800 bg-gray-900/70 backdrop-blur-md shadow-inner">
        <ChatInput
          placeholder={`Message ${member?.user.name}`}
          conversationId={id}
        />
      </div>
    </div>
  );
};
