"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCreateNote } from "../api/use-create-note";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateNoteModal } from "../store/use-create-note-modal";
import { toast } from "sonner";

export const CreateNoteModal = () => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateNoteModal();
  const { mutate, isPending } = useCreateNote();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setContent("");
    setTagInput("");
    setTags([]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    mutate(
      {
        title: title.trim(),
        content: content.trim(),
        workspaceId,
        tags,
      },
      {
        onSuccess: () => {
          toast.success("Note created successfully");
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create note");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          max-w-2xl max-h-[90vh] overflow-y-auto 
          bg-gradient-to-br from-black via-gray-900 to-black
          backdrop-blur-xl
          border border-white/10
          shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)]
          text-white rounded-2xl
          transition-all duration-300
          hover:shadow-[0_0_50px_-5px_rgba(56,189,248,0.5)]
        "
      >
        <DialogHeader className="text-center">
          <DialogTitle
            className="
              text-3xl font-extrabold 
              bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 
              bg-clip-text text-transparent 
              tracking-wide drop-shadow-lg
            "
          >
            📝 Create New Note
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              disabled={isPending}
              required
              className="
                bg-white/5 border border-white/10 
                text-white placeholder:text-gray-500
                focus:border-cyan-400 focus:ring-cyan-400
                transition-all duration-300
              "
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-gray-300">
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note content here..."
              rows={8}
              disabled={isPending}
              required
              className="
                bg-white/5 border border-white/10 
                text-white placeholder:text-gray-500
                focus:border-purple-400 focus:ring-purple-400
                transition-all duration-300 resize-none
              "
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-300">
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags (press Enter)"
                disabled={isPending}
                className="
                  bg-white/5 border border-white/10 
                  text-white placeholder:text-gray-500
                  focus:border-blue-400 focus:ring-blue-400
                  transition-all duration-300
                "
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={isPending}
                className="
                  border border-blue-500/50 text-blue-300
                  hover:bg-blue-600/20 hover:text-white
                  transition-all duration-300
                "
              >
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="
                      gap-1 px-3 py-1 text-sm 
                      bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20
                      border border-white/10
                      text-cyan-300
                      hover:bg-gradient-to-r hover:from-purple-500/30 hover:via-blue-500/30 hover:to-cyan-500/30
                      transition-all duration-300
                    "
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-400 transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="
                border border-purple-500/50 text-purple-300
                hover:bg-purple-600/20 hover:text-white
                transition-all duration-300
              "
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="
                bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 
                text-white font-semibold
                hover:shadow-[0_0_20px_rgba(56,189,248,0.6)]
                transition-all duration-300
              "
            >
              {isPending ? "Creating..." : "Create Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
