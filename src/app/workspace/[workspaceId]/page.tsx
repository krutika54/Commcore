"use client";

import { useMemo, useEffect } from "react";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";
import { useCurrentMember } from "@/features/members/api/use-current-member";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    member,
    memberLoading,
    isAdmin,
    channelId,
    workspaceLoading,
    channelsLoading,
    workspace,
    open,
    setOpen,
    router,
    workspaceId,
  ]);

  // Unified Loader UI
  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#0d0d0d] text-gray-300">
        <Loader className="size-8 animate-spin text-purple-400 mb-3" />
        <p className="text-sm text-gray-400">Loading workspace...</p>
      </div>
    );
  }

  // Not Found UI
  if (!workspace || !member) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#0d0d0d] text-gray-300">
        <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg px-6 py-10 flex flex-col items-center shadow-lg">
          <TriangleAlert className="size-8 text-yellow-500 mb-3" />
          <span className="text-sm text-gray-400">Workspace not found</span>
        </div>
      </div>
    );
  }

  // No Channel UI
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#0d0d0d] text-gray-300">
      <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg px-6 py-10 flex flex-col items-center shadow-lg">
        <TriangleAlert className="size-8 text-purple-400 mb-3" />
        <span className="text-sm text-gray-400">No channel found</span>
      </div>
    </div>
  );
};

export default WorkspaceIdPage;
