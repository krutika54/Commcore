"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeleteDocument } from "../api/use-delete-document";
import { toast } from "sonner";
import { format } from "date-fns";

interface DocumentCardProps {
  document: any;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const { mutate: deleteDoc, isPending } = useDeleteDocument();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this document?")) {
      deleteDoc(
        { docId: document._id },
        {
          onSuccess: () => toast.success("Document deleted successfully"),
          onError: () => toast.error("Failed to delete document"),
        }
      );
    }
  };

  const handleDownload = () => {
    if (document.url) window.open(document.url, "_blank");
  };

  return (
    <Card
      className="
        group relative transition-all duration-300
        border border-white/10
        bg-gradient-to-br from-black via-gray-900 to-black
        backdrop-blur-lg
        hover:shadow-[0_0_25px_-5px_rgba(56,189,248,0.5)]
        rounded-xl overflow-hidden
      "
    >
      <div
        className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10
          transition-opacity duration-500
        "
      />

      <CardContent className="p-5 relative z-10">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className="
              p-3 rounded-lg
              bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20
              text-cyan-300
              group-hover:from-purple-500/30 group-hover:to-cyan-500/30
              transition-all duration-300
            "
          >
            <FileText className="size-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4
              className="
                font-semibold text-sm truncate 
                bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 
                bg-clip-text text-transparent
              "
            >
              {document.name}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatFileSize(document.fileSize)} • {document.fileType}
            </p>

            {document.description && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                {document.description}
              </p>
            )}

            {document.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {document.tags.map((tag: string, i: number) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="
                      text-[10px] px-2 py-0.5 
                      bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20
                      text-cyan-300 border border-white/10
                      hover:from-purple-600/30 hover:to-cyan-600/30
                      transition-all duration-300
                    "
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                {document.uploader && (
                  <>
                    <Avatar className="size-6 border border-white/20">
                      <AvatarImage src={document.uploader.user?.image} />
                      <AvatarFallback className="text-[10px] text-gray-300 bg-gray-800">
                        {document.uploader.user?.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-400">
                      {format(new Date(document.createdAt), "MMM dd")}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="
                    h-7 w-7 p-0 
                    text-cyan-300 
                    hover:text-white 
                    hover:bg-cyan-600/20 
                    transition-all duration-300
                  "
                >
                  <Download className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="
                    h-7 w-7 p-0 
                    text-red-400 
                    hover:text-red-300 
                    hover:bg-red-600/20 
                    transition-all duration-300
                  "
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
