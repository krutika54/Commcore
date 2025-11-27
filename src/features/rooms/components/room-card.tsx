"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Lock, Globe, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useJoinRoom } from "../api/use-join-room";
import { toast } from "sonner";

interface RoomCardProps {
  room: any;
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate: joinRoom, isPending } = useJoinRoom();

  const handleJoinOrEnter = () => {
    if (room.isMember) {
      router.push(`/workspace/${workspaceId}/rooms/${room._id}`);
    } else {
      joinRoom(
        { roomId: room._id },
        {
          onSuccess: () => {
            toast.success("Joined room successfully");
            router.push(`/workspace/${workspaceId}/rooms/${room._id}`);
          },
          onError: () => {
            toast.error("Failed to join room");
          },
        }
      );
    }
  };

  return (
    <Card className="group hover:shadow-[0_0_25px_-5px_rgba(56,189,248,0.6)] hover:-translate-y-1 transition-all duration-300 rounded-2xl bg-gradient-to-br from-black via-gray-900 to-black border border-white/10 shadow-[0_0_15px_-5px_rgba(56,189,248,0.3)] backdrop-blur-xl overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-cyan-600/5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                {room.name}
              </h3>
              {room.isPrivate ? (
                <Lock className="size-4 text-amber-400" />
              ) : (
                <Globe className="size-4 text-cyan-400" />
              )}
            </div>
            <Badge 
              variant="outline" 
              className="text-xs bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 text-cyan-200 border-white/20 shadow-[0_0_5px_rgba(56,189,248,0.2)]"
            >
              {room.topic}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {room.description && (
          <p className="text-sm text-gray-300 line-clamp-2">
            {room.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Users className="size-4 text-cyan-400" />
              <span>{room.memberCount || 0}</span>
              {room.maxMembers && <span>/ {room.maxMembers}</span>}
            </div>
            {room.creator && (
              <div className="flex items-center gap-1.5">
                <Avatar className="size-5 ring-1 ring-white/20">
                  <AvatarImage src={room.creator.user?.image} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                    {room.creator.user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleJoinOrEnter}
            disabled={isPending}
            variant={room.isMember ? "outline" : "default"}
            className={
              room.isMember
                ? "bg-black/30 border-white/20 text-cyan-300 hover:bg-gradient-to-r hover:from-purple-600/20 hover:via-blue-600/20 hover:to-cyan-600/20 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)] transition-all duration-300"
                : "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white border-0 shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] transition-all duration-300"
            }
          >
            {room.isMember ? (
              <>
                Enter <ArrowRight className="size-4 ml-1" />
              </>
            ) : (
              "Join Room"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};