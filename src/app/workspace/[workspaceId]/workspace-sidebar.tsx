"use client";

import { 
  AlertTriangle, 
  Loader, 
  MessageSquareText, 
  SendHorizontal, 
  HashIcon, 
  CheckSquare, 
  BookOpen, 
  Users 
} from "lucide-react";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useChannelId } from "@/hooks/use-channel-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useMemberId } from "@/hooks/use-member-id";

export const WorkspaceSidebar = () => {
  const memberId = useMemberId();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

  // 🌀 Loading State
  if (workspaceLoading || memberLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gradient-to-br from-[#1e1e1e] to-[#2d0e31]">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  // ⚠️ Not Found State
  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center bg-gradient-to-br from-[#1e1e1e] to-[#2d0e31]">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm opacity-80">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#0f0f0f] via-[#201020] to-[#3a1843] border-r border-white/10">
      {/* Header */}
      <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />

      {/* Core Navigation */}
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <SidebarItem label="Drafts & Sent" icon={SendHorizontal} id="drafts" />
      </div>

      {/* Productivity Tools */}
      <WorkspaceSection label="Features" hint="Productivity tools">
        <SidebarItem label="Tasks" icon={CheckSquare} id="tasks" />
        <SidebarItem label="Knowledge Hub" icon={BookOpen} id="knowledge" />
        <SidebarItem label="Discussion Rooms" icon={Users} id="rooms" />
      </WorkspaceSection>

      {/* Channels */}
      <WorkspaceSection
        label="Channels"
        hint="Create new channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => (
          <SidebarItem
            key={item._id}
            icon={HashIcon}
            label={item.name}
            id={item._id}
            variant={channelId === item._id ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>

      {/* Members */}
      <WorkspaceSection
        label="Direct Messages"
        hint="Start a new direct message"
      >
        {members?.map((item) => (
          <UserItem
            key={item._id}
            id={item._id}
            label={item.user.name}
            image={item.user.image}
            variant={item._id === memberId ? "active" : "default"}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};
