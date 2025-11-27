"use client";

import { Thread } from "@/features/messages/components/thread";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Profile } from "@/features/members/components/profile";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, profileMemberId, onClose } = usePanel();
  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div className="h-full bg-[#0d0d0d] text-gray-200 flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm z-10 shadow-sm">
        <Toolbar />
      </div>

      {/* Main Workspace Section */}
      <div className="flex flex-1 h-[calc(100vh-40px)]">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Resizable Panel Layout */}
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ca-workspace-layout"
          className="flex-1"
        >
          {/* Workspace Sidebar (Channels / Navigation) */}
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-black/30 backdrop-blur-md border-r border-white/10 shadow-inner"
          >
            <WorkspaceSidebar />
          </ResizablePanel>

          <ResizableHandle className="bg-white/5 hover:bg-purple-500/30 transition-all" withHandle />

          {/* Main Content Area */}
          <ResizablePanel
            minSize={20}
            defaultSize={80}
            className="bg-[#111111] overflow-hidden shadow-md"
          >
            {children}
          </ResizablePanel>

          {/* Right Panel (Thread / Profile) */}
          {showPanel && (
            <>
              <ResizableHandle className="bg-white/5 hover:bg-purple-500/30 transition-all" withHandle />
              <ResizablePanel
                minSize={20}
                defaultSize={29}
                className="bg-black/40 backdrop-blur-md border-l border-white/10"
              >
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<"members">}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;
