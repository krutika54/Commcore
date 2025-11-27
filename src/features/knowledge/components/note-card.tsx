"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pin, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTogglePinNote } from "../api/use-toggle-pin-note";
import { useDeleteNote } from "../api/use-delete-note";
import { toast } from "sonner";

interface NoteCardProps {
  note: any;
}

export const NoteCard = ({ note }: NoteCardProps) => {
  const { mutate: togglePin, isPending: isPinning } = useTogglePinNote();
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  const handleTogglePin = () => {
    togglePin(
      { noteId: note._id },
      {
        onSuccess: () => {
          toast.success(note.isPinned ? "Note unpinned" : "Note pinned");
        },
        onError: () => {
          toast.error("Failed to update pin status");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(
        { noteId: note._id },
        {
          onSuccess: () => {
            toast.success("Note deleted successfully");
          },
          onError: () => {
            toast.error("Failed to delete note");
          },
        }
      );
    }
  };

  return (
    <Card
      className={`
        group transition-all duration-300 
        hover:shadow-[0_0_25px_-5px_rgba(56,189,248,0.6)]
        hover:-translate-y-1 
        rounded-2xl 
        bg-gradient-to-br from-black via-gray-900 to-black
        backdrop-blur-xl
        overflow-hidden
        ${
          note.isPinned
            ? "border-2 border-amber-400/60 shadow-[0_0_20px_-5px_rgba(251,191,36,0.5)]"
            : "border border-white/10 shadow-[0_0_15px_-5px_rgba(56,189,248,0.3)]"
        }
      `}
    >
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-cyan-600/5">
        <div className="flex items-start justify-between gap-3">
          {/* LEFT SECTION */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:via-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
              {note.title}
            </h3>

            {/* META INFO */}
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
              {note.creator && (
                <div className="flex items-center gap-1.5">
                  <Avatar className="size-5 ring-1 ring-white/20">
                    <AvatarImage src={note.creator.user?.image} />
                    <AvatarFallback className="text-[10px] bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                      {note.creator.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{note.creator.user?.name}</span>
                </div>
              )}

              <span className="flex items-center gap-1 shrink-0">
                <Calendar className="size-3" />
                {format(new Date(note.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTogglePin}
              disabled={isPinning}
              className={`
                h-8 w-8 p-0 
                transition-all duration-300
                rounded-lg
                border border-white/10
                ${
                  note.isPinned
                    ? "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                    : "text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 hover:shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                }
              `}
            >
              <Pin
                className={`size-4 transition-transform ${
                  note.isPinned ? "rotate-12" : "group-hover:rotate-6"
                }`}
              />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] rounded-lg border border-white/10 transition-all duration-300"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <p className="text-sm text-gray-300 line-clamp-3 mb-3 leading-relaxed">
          {note.content}
        </p>

        {/* TAGS */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((tag: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 text-cyan-200 hover:from-purple-600/30 hover:via-blue-600/30 hover:to-cyan-600/30 transition-all duration-300 rounded-md px-2 py-[2px] border border-white/10 shadow-[0_0_5px_rgba(56,189,248,0.2)]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};