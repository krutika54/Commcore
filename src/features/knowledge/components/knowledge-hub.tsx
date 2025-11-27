"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotesList } from "./notes-list";
import { FaqsList } from "./faqs-list";
import { DocumentsList } from "./documents-list";
import { FileText, HelpCircle, FolderOpen } from "lucide-react";

export const KnowledgeHub = () => {
  return (
    <div
      className="
        h-full flex flex-col
        bg-gradient-to-br from-black via-gray-900 to-black
        border border-white/10
        rounded-2xl
        shadow-[0_0_25px_-5px_rgba(56,189,248,0.4)]
        backdrop-blur-xl
        overflow-hidden
      "
    >
      <Tabs defaultValue="notes" className="flex-1 flex flex-col">
        {/* Tabs Header */}
        <div
          className="
            border-b border-white/10 
            px-6 py-3 
            bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10
            backdrop-blur-md
            shadow-[0_0_12px_rgba(56,189,248,0.25)]
          "
        >
          <TabsList
            className="
              grid w-full max-w-md grid-cols-3 mx-auto
              rounded-xl
              bg-black/30
              border border-white/10
              shadow-[0_0_15px_-3px_rgba(56,189,248,0.25)]
              backdrop-blur-md
            "
          >
            {/* Notes */}
            <TabsTrigger
              value="notes"
              className="
                flex items-center justify-center gap-2 py-2
                text-gray-300
                transition-all duration-300
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-blue-600 data-[state=active]:to-cyan-600
                data-[state=active]:text-white 
                data-[state=active]:shadow-[0_0_10px_rgba(56,189,248,0.5)]
                rounded-lg
              "
            >
              <FileText className="size-4" />
              Notes
            </TabsTrigger>

            {/* FAQs */}
            <TabsTrigger
              value="faqs"
              className="
                flex items-center justify-center gap-2 py-2
                text-gray-300
                transition-all duration-300
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-blue-600 data-[state=active]:to-cyan-600
                data-[state=active]:text-white 
                data-[state=active]:shadow-[0_0_10px_rgba(56,189,248,0.5)]
                rounded-lg
              "
            >
              <HelpCircle className="size-4" />
              FAQs
            </TabsTrigger>

            {/* Documents */}
            <TabsTrigger
              value="documents"
              className="
                flex items-center justify-center gap-2 py-2
                text-gray-300
                transition-all duration-300
                data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-blue-600 data-[state=active]:to-cyan-600
                data-[state=active]:text-white 
                data-[state=active]:shadow-[0_0_10px_rgba(56,189,248,0.5)]
                rounded-lg
              "
            >
              <FolderOpen className="size-4" />
              Documents
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Sections */}
        <TabsContent value="notes" className="flex-1 m-0 overflow-hidden">
          <NotesList />
        </TabsContent>

        <TabsContent value="faqs" className="flex-1 m-0 overflow-hidden">
          <FaqsList />
        </TabsContent>

        <TabsContent value="documents" className="flex-1 m-0 overflow-hidden">
          <DocumentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};
