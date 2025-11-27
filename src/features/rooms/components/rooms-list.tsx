"use client";

import { useGetRooms } from "../api/use-get-rooms";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import { RoomCard } from "./room-card";
import { useCreateRoomModal } from "../store/use-create-room-modal";

export const RoomsList = () => {
  const workspaceId = useWorkspaceId();
  const { data: rooms, isLoading } = useGetRooms({ workspaceId });
  const [_open, setOpen] = useCreateRoomModal();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <Loader className="size-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div
      className="
        h-full flex flex-col
        bg-gradient-to-br from-black via-gray-900 to-black
        border border-white/10
        rounded-2xl
        shadow-[0_0_25px_-5px_rgba(56,189,248,0.35)]
        backdrop-blur-xl
        overflow-hidden
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between px-6 py-4
          border-b border-white/10
          bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10
          backdrop-blur-md
        "
      >
        <div>
          <h1
            className="
              text-2xl font-bold
              bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400
              bg-clip-text text-transparent
              drop-shadow-[0_0_10px_rgba(56,189,248,0.25)]
            "
          >
            Discussion Rooms
          </h1>
          <p className="text-sm text-gray-400">Join focused conversations on specific topics</p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="
            bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
            text-white
            hover:opacity-90
            shadow-[0_0_12px_rgba(56,189,248,0.35)]
            transition-all duration-300
            gap-2
          "
        >
          <Plus className="size-4 mr-2" />
          New Room
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!rooms || rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <p className="text-gray-400 text-sm">No rooms yet</p>
            <Button
              onClick={() => setOpen(true)}
              className="
                bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
                text-white
                hover:opacity-90
                shadow-[0_0_15px_rgba(56,189,248,0.35)]
                transition-all duration-300
              "
            >
              Create your first room
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
