"use client";

import { Info, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const [open, setOpen] = useState(false);

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav
      className="
        flex items-center justify-between 
        h-10 px-2
        bg-gradient-to-r from-[#0a0a0a] via-[#0d0d0d] to-[#111111]
        border-b border-white/10
        shadow-[0_1px_0_rgba(255,255,255,0.05)]
        backdrop-blur-sm
      "
    >
      {/* Left Spacer */}
      <div className="flex-1" />

      {/* Center: Search */}
      <div className="min-w-[280px] max-w-[480px] flex-1 flex justify-center">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="
            w-full h-7 px-2 
            justify-start
            bg-[#1a1a1a] hover:bg-[#222] 
            border border-white/10 
            text-white text-xs font-medium
            transition-all duration-150
          "
        >
          <Search className="size-4 text-white/80 mr-2" />
          <span className="truncate text-white/90">
            Search {data?.name || "workspace"}
          </span>
        </Button>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => onChannelClick(channel._id)}
                >
                  {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => onMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      {/* Right Section: Info */}
      <div className="flex-1 flex justify-end items-center">
        <Button
          variant="ghost"
          size="icon-Sm"
          className="hover:bg-white/10 transition-colors"
        >
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
