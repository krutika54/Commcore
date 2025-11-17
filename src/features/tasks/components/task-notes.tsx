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
      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      // Save to database
      await addAttachment({
        taskId,
        name: file.name,
        fileId: storageId,
        fileType: file.type,
        fileSize: file.size,
      });

      toast.success("File uploaded successfully");
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (attachmentId: Id<"taskAttachments">) => {
    try {
      await removeAttachment({ attachmentId });
      toast.success("File deleted");
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
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
        >
          <Upload className="size-4 mr-2" />
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!attachments ? (
          <div className="flex justify-center py-8">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : attachments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="size-12 mx-auto mb-2 opacity-50" />
            <p>No files attached yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <div
                key={attachment._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileText className="size-5 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(attachment.createdAt), "MMM dd, yyyy")} •{" "}
                      {(attachment.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(attachment.url, "_blank")}
                  >
                    <Download className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
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
