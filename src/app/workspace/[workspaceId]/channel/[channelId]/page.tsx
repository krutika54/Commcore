"use client";
import { Loader, TriangleAlert } from "lucide-react";
import useGetChannel from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { MessageList } from "@/components/message-list";

const ChannelIdPage = () => {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({ channelId });
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center bg-gray-950/90 text-gray-300">
        <Loader className="animate-spin size-6 text-purple-400" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-3 items-center justify-center bg-gray-950/90 text-gray-400">
        <TriangleAlert className="size-7 text-rose-500/80" />
        <span className="text-sm text-gray-400">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-950 via-gray-900/95 to-gray-950 text-gray-100">
      {/* Channel Header */}
      <Header title={channel.name} />

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900/40">
        <MessageList
          channelName={channel.name}
          channelCreationTime={channel._creationTime}
          data={results}
          loadMore={loadMore}
          isLoadingMore={status === "LoadingMore"}
          canLoadMore={status === "CanLoadMore"}
        />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-800/60 bg-gray-900/50 backdrop-blur-sm">
        <ChatInput placeholder={`Message # ${channel.name}`} />
      </div>
    </div>
  );
};

export default ChannelIdPage;
