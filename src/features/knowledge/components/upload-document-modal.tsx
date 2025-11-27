"use client";

import { useState, useRef } from "react";
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
import { X, Upload, File, Tag } from "lucide-react";
import { useUploadDocument } from "../api/use-upload-document";
import { useGenerateUploadUrl } from "../api/use-generate-upload-url";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useUploadDocumentModal } from "../store/use-upload-document-modal";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

export const UploadDocumentModal = () => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useUploadDocumentModal();
  const { mutate: uploadDoc, isPending } = useUploadDocument();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setDescription("");
    setTagInput("");
    setTags([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      const uploadUrl = await generateUploadUrl();
      if (!uploadUrl) {
        toast.error("Failed to generate upload URL");
        return;
      }

      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResult.ok) {
        toast.error("Failed to upload file");
        return;
      }

      const { storageId } = await uploadResult.json();

      uploadDoc(
        {
          name: file.name,
          fileId: storageId as Id<"_storage">,
          fileType: file.type,
          fileSize: file.size,
          workspaceId,
          description: description.trim() || undefined,
          tags,
        },
        {
          onSuccess: () => {
            toast.success("Document uploaded successfully");
            handleClose();
          },
          onError: () => {
            toast.error("Failed to save document");
          },
        }
      );
    } catch (error) {
      toast.error("Upload failed");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg rounded-2xl bg-gradient-to-br from-black via-gray-900 to-black border border-white/10 shadow-[0_0_30px_-5px_rgba(56,189,248,0.5)] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            📤 Upload a New Document
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div className="space-y-2">
            <Label className="text-gray-300">File *</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-lg p-6 cursor-pointer hover:bg-gradient-to-br hover:from-purple-600/10 hover:via-blue-600/10 hover:to-cyan-600/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]"
            >
              <Upload className="size-6 text-cyan-400 mb-2" />
              <span className="text-sm text-gray-400">
                {file ? file.name : "Click to choose a file"}
              </span>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              disabled={isPending}
              className="hidden"
            />
            {file && (
              <div className="flex items-center justify-between mt-2 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 px-3 py-2 rounded-md border border-white/10 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                <div className="flex items-center gap-2">
                  <File className="size-4 text-cyan-400" />
                  <span className="text-sm truncate text-gray-300">{file.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFile(null)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <X className="size-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe this document..."
              rows={3}
              disabled={isPending}
              className="resize-none bg-black/30 border-white/10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-gray-300">Tags</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag and press Enter"
                  disabled={isPending}
                  className="pr-10 bg-black/30 border-white/10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                />
                <Tag className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-cyan-400" />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={isPending}
                className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 border-white/10 text-cyan-300 hover:from-purple-600/30 hover:via-blue-600/30 hover:to-cyan-600/30 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)] transition-all duration-300"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 text-sm bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 text-cyan-200 hover:from-purple-600/30 hover:via-blue-600/30 hover:to-cyan-600/30 transition-all duration-300 border border-white/10 shadow-[0_0_5px_rgba(56,189,248,0.2)]"
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
          <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="bg-black/30 border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !file}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white border-0 shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
            >
              {isPending ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};