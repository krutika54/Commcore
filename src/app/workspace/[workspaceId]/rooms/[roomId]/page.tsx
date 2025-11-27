"use client";

import { useParams } from "next/navigation";
import { RoomChat } from "@/features/rooms/components/room-chat";
import { RoomHeader } from "@/features/rooms/components/room-header";
import { Id } from "../../../../../../convex/_generated/dataModel";

const RoomPage = () => {
  const params = useParams();
  const roomId = params.roomId as Id<"discussionRooms">;

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] text-gray-200">
      {/* Header Section */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm z-10">
        <RoomHeader roomId={roomId} />
      </div>

      {/* Chat Section */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full flex flex-col">
          <RoomChat roomId={roomId} />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
