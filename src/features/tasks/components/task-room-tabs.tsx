"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskDiscussion } from "./task-discussion";
import { TaskNotes } from "./task-notes";
import { TaskInfo } from "./task-info";
import { Id } from "../../../../convex/_generated/dataModel";

interface TaskRoomTabsProps {
  taskId: Id<"tasks">;
}

export const TaskRoomTabs = ({ taskId }: TaskRoomTabsProps) => {
  const [activeTab, setActiveTab] = useState("discussion");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-background/60 to-muted/20 backdrop-blur-xl rounded-xl border border-border/40 shadow-sm transition-all duration-300">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        {/* Tab Header */}
        <div className="border-b border-border/60 px-4 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md">
          <TabsList className="h-12 gap-3 p-1 bg-transparent">
            <TabsTrigger
              value="discussion"
              className="px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-inner hover:bg-primary/5"
            >
              💬 Discussion
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-inner hover:bg-primary/5"
            >
              📎 Notes & Files
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="px-4 py-2 text-sm font-medium rounded-md transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-inner hover:bg-primary/5"
            >
              🧭 Task Info
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Panels */}
        <TabsContent
          value="discussion"
          className="flex-1 m-0 overflow-hidden animate-fade-in"
        >
          <TaskDiscussion taskId={taskId} />
        </TabsContent>

        <TabsContent
          value="notes"
          className="flex-1 m-0 overflow-hidden animate-fade-in"
        >
          <TaskNotes taskId={taskId} />
        </TabsContent>

        <TabsContent
          value="info"
          className="flex-1 m-0 overflow-hidden animate-fade-in"
        >
          <TaskInfo taskId={taskId} showCompleted />
        </TabsContent>
      </Tabs>
    </div>
  );
};
