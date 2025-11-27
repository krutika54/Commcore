"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Loader, Upload, FileText, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { format } from "date-fns";

interface TaskNotesProps {
  taskId: Id<"tasks">;
}

export const TaskNotes = ({ taskId }: TaskNotesProps) => {
  const attachments = useQuery(api.tasks.getAttachments, { taskId });
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const addAttachment = useMutation(api.tasks.addAttachment);
  const removeAttachment = useMutation(api.tasks.removeAttachment);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      await addAttachment({
        taskId,
        name: file.name,
        fileId: storageId,
        fileType: file.type,
        fileSize: file.size,
      });

      toast.success("File uploaded successfully");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (attachmentId: Id<"taskAttachments">) => {
    try {
      await removeAttachment({ attachmentId });
      toast.success("File deleted");
    } catch {
      toast.error("Failed to delete file");
    }
  };

  return (
    <div
      className="flex flex-col h-full rounded-xl overflow-hidden
      bg-gradient-to-br from-[#0f0c17] via-[#161221] to-[#1d1630]
      border border-white/10 shadow-[0_0_25px_rgba(139,92,246,0.25)]
      text-gray-200"
    >
      {/* Upload Bar */}
      <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm flex justify-between items-center">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          size="sm"
          className="bg-purple-600 hover:bg-purple-500 text-white transition-all"
        >
          <Upload className="size-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </div>

      {/* Attachments List */}
      <div className="flex-1 overflow-y-auto p-4">
        {!attachments ? (
          <div className="flex justify-center py-8">
            <Loader className="size-6 animate-spin text-purple-400" />
          </div>
        ) : attachments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="size-12 mx-auto mb-3 opacity-40" />
            <p>No files attached yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {attachments.map((attachment) => (
              <div
                key={attachment._id}
                className="flex items-center justify-between p-4 rounded-lg
                  bg-white/5 border border-white/10
                  hover:bg-white/10 hover:border-purple-400/30 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="size-5 text-purple-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(attachment.createdAt), "MMM dd, yyyy")} •{" "}
                      {(attachment.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
  variant="ghost"
  size="icon"
  onClick={() => {
    if (attachment.url) {
      window.open(attachment.url, "_blank");
    } else {
      toast.error("File URL not available");
    }
  }}
>
  <Download className="size-4" />
</Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-red-400 hover:bg-red-400/10"
                    onClick={() => handleDelete(attachment._id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
