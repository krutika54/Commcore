"use client";

import { useGetNotes } from "../api/use-get-notes";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import { NoteCard } from "./note-card";
import { useCreateNoteModal } from "../store/use-create-note-modal";

export const NotesList = () => {
  const workspaceId = useWorkspaceId();
  const { data: notes, isLoading } = useGetNotes({ workspaceId });
  const [_open, setOpen] = useCreateNoteModal();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <Loader className="size-6 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 backdrop-blur-md shadow-[0_0_12px_rgba(56,189,248,0.25)]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Shared Notes
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Collaborate and share notes with your team
          </p>
        </div>
        <Button 
          onClick={() => setOpen(true)} 
          size="sm" 
          className="gap-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white border-0 shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.6)]"
        >
          <Plus className="size-4" />
          New Note
        </Button>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-black via-gray-900 to-black">
        {!notes || notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <Plus className="size-10 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-300 text-lg font-medium mb-1">No notes yet</p>
              <p className="text-gray-500 text-sm">Create your first note to get started</p>
            </div>
            <Button 
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white border-0 shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.6)]"
            >
              Create your first note
            </Button>
          </div>
        ) : (
          <>
            {/* Highlight pinned notes */}
            {notes.some((note) => note.isPinned) && (
              <div className="mb-6">
                <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <span className="text-amber-400">📌</span>
                  <span>Pinned Notes</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent"></div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes
                    .filter((note) => note.isPinned)
                    .map((note) => (
                      <NoteCard key={note._id} note={note} />
                    ))}
                </div>
              </div>
            )}

            {/* Regular notes */}
            <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <span>All Notes</span>
              <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/30 to-transparent"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes
                .filter((note) => !note.isPinned)
                .map((note) => (
                  <NoteCard key={note._id} note={note} />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};