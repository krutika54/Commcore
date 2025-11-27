"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface RoomHeaderProps {
  roomId: Id<"discussionRooms">;
}

export const RoomHeader = ({ roomId }: RoomHeaderProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const room = useQuery(api.discussionRooms.getById, { roomId });

  if (!room) {
    return (
      <div className="h-14 border-b border-white/10 flex items-center px-4 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 backdrop-blur-md">
        <div className="h-4 w-32 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 animate-pulse rounded border border-white/10" />
      </div>
    );
  }

  return (
    <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 backdrop-blur-md shadow-[0_0_12px_rgba(56,189,248,0.25)]">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/workspace/${workspaceId}/rooms`)}
          className="text-gray-400 hover:text-cyan-400 hover:bg-gradient-to-r hover:from-purple-600/20 hover:via-blue-600/20 hover:to-cyan-600/20 transition-all duration-300 border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="font-semibold text-white bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {room.name}
          </h1>
          <p className="text-xs text-gray-400">{room.topic}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-gray-400 hover:text-cyan-400 hover:bg-gradient-to-r hover:from-purple-600/20 hover:via-blue-600/20 hover:to-cyan-600/20 transition-all duration-300 border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]"
        >
          <Users className="size-4" />
          <span className="text-sm">{room.memberCount || 0}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-gray-400 hover:text-cyan-400 hover:bg-gradient-to-r hover:from-purple-600/20 hover:via-blue-600/20 hover:to-cyan-600/20 transition-all duration-300 border border-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]"
        >
          <Settings className="size-4" />
        </Button>
      </div>
    </div>
  );
};