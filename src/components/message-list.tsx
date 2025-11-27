import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { Message } from "./message";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { Id } from "../../convex/_generated/dataModel";
import { ChannelHero } from "./channel-hero";
import { useState } from "react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { Loader } from "lucide-react";
import { ConversationHero } from "./conversation-hero";

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  data,
  variant = "channel",
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce((groups, message) => {
    const date = new Date(message._creationTime);
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].unshift(message);
    return groups;
  }, {} as Record<string, typeof data>);

  return (
    <div
      className="flex-1 flex flex-col-reverse overflow-y-auto pb-6 messages-scrollbar 
                 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100"
    >
      {/* Messages grouped by date */}
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey} className="px-4 md:px-6">
          {/* Date Separator */}
          <div className="text-center my-6 relative">
            <div className="absolute top-1/2 left-0 right-0 border-t border-gray-700" />
            <span
              className="relative inline-block bg-gray-900 px-4 py-1 rounded-full 
                         text-xs font-medium text-gray-400 border border-gray-700 shadow-sm"
            >
              {formatDateLabel(dateKey)}
            </span>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-1.5">
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user?._id === message.user?._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THRESHOLD;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={message.memberId === currentMember?._id}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton={variant === "thread"}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadName={message.threadName}
                  threadTimeStamp={message.threadTimeStamp}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Infinite Scroll Trigger */}
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              { threshold: 1.0 }
            );
            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />

      {/* Loading Indicator */}
      {isLoadingMore && (
        <div className="text-center my-4 relative">
          <div className="absolute top-1/2 left-0 right-0 border-t border-gray-700" />
          <span
            className="relative inline-flex items-center gap-2 bg-gray-900 px-4 py-1.5 rounded-full 
                       text-xs font-medium text-gray-400 border border-gray-700 shadow-sm"
          >
            <Loader className="size-4 animate-spin text-purple-400" />
            Loading more messages...
          </span>
        </div>
      )}

      {/* Channel or Conversation Intro */}
      {variant === "channel" && channelName && channelCreationTime && (
        <div className="px-4 md:px-6 mt-6">
          <ChannelHero name={channelName} creationTime={channelCreationTime} />
        </div>
      )}

      {variant === "conversation" && (
        <div className="px-4 md:px-6 mt-6">
          <ConversationHero name={memberName} image={memberImage} />
        </div>
      )}
    </div>
  );
};
