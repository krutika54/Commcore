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
    <div className="flex-1 flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-12">
            <TabsTrigger value="discussion" className="gap-2">
              Discussion
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              Notes & Files
            </TabsTrigger>
            <TabsTrigger value="info" className="gap-2">
              Task Info
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="discussion" className="flex-1 m-0 overflow-hidden">
          <TaskDiscussion taskId={taskId} />
        </TabsContent>

        <TabsContent value="notes" className="flex-1 m-0 overflow-hidden">
          <TaskNotes taskId={taskId} />
        </TabsContent>

        <TabsContent value="info" className="flex-1 m-0 overflow-hidden">
          <TaskInfo taskId={taskId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
