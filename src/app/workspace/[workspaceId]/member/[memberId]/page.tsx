"use client";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess(data) {
          setConversationId(data);
        },
        onError() {
          toast.error("Failed to create or get conversation");
        },
      }
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader className="size-6 animate-spin text-purple-400" />
          <p className="text-sm text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col gap-y-3 items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-gray-800 shadow-lg bg-gray-900/70 backdrop-blur-md">
          <AlertTriangle className="size-7 text-yellow-400" />
          <span className="text-sm text-gray-300 font-medium">
            Conversation not found
          </span>
          <p className="text-xs text-gray-500">
            Try refreshing or returning to your workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <Conversation id={conversationId} />
    </div>
  );
};

export default MemberIdPage;
