"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpvoteFaq } from "../api/use-upvote-faq";
import { useDeleteFaq } from "../api/use-delete-faq";
import { toast } from "sonner";
import { useState } from "react";

interface FaqCardProps {
  faq: any;
}

export const FaqCard = ({ faq }: FaqCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: upvote, isPending: isUpvoting } = useUpvoteFaq();
  const { mutate: deleteFaq, isPending: isDeleting } = useDeleteFaq();

  const handleUpvote = () => {
    upvote(
      { faqId: faq._id },
      {
        onSuccess: () => toast.success("Upvoted!"),
        onError: () => toast.error("Failed to upvote"),
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteFaq(
        { faqId: faq._id },
        {
          onSuccess: () => toast.success("FAQ deleted successfully"),
          onError: () => toast.error("Failed to delete FAQ"),
        }
      );
    }
  };

  return (
    <Card
      className={`
        group transition-all duration-500 rounded-2xl
        backdrop-blur-xl border border-white/10
        bg-gradient-to-br from-black via-gray-900 to-black
        shadow-[0_0_20px_-5px_rgba(56,189,248,0.25)]
        hover:shadow-[0_0_30px_-4px_rgba(56,189,248,0.45)]
        ${faq.isPinned ? "border-amber-300/60 shadow-amber-500/40" : ""}
      `}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          {/* Expand Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 text-left transition-all duration-300 hover:opacity-80"
          >
            <div className="flex items-start gap-3">
              {isExpanded ? (
                <ChevronUp className="size-5 mt-0.5 text-cyan-300 drop-shadow-sm" />
              ) : (
                <ChevronDown className="size-5 mt-0.5 text-cyan-300 drop-shadow-sm" />
              )}

              <h3
                className="
                  font-semibold text-lg leading-snug break-words
                  bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400
                  bg-clip-text text-transparent
                  drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]
                "
              >
                {faq.question}
              </h3>
            </div>
          </button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="
              h-8 w-8 p-0 rounded-full
              text-red-400 hover:text-red-300
              hover:bg-red-500/10
              transition-all duration-300
              shadow-[0_0_10px_rgba(255,0,0,0.2)]
            "
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Expanded Content */}
      {isExpanded && (
        <CardContent className="animate-fade-in">
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            {faq.answer}
          </p>

          {/* Footer (Creator + Upvote Button) */}
          <div
            className="
              flex items-center justify-between pt-4
              border-t border-white/10
            "
          >
            {/* Creator */}
            <div className="flex items-center gap-2">
              {faq.creator && (
                <div className="flex items-center gap-2">
                  <Avatar className="size-6 ring-1 ring-white/20 shadow-md">
                    <AvatarImage src={faq.creator.user?.image} />
                    <AvatarFallback className="text-xs">
                      {faq.creator.user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-xs text-gray-400 font-medium">
                    {faq.creator.user?.name}
                  </span>
                </div>
              )}
            </div>

            {/* Upvote */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              disabled={isUpvoting}
              className="
                h-8 gap-2 rounded-full
                text-cyan-300 hover:text-cyan-200
                hover:bg-cyan-500/10
                transition-all duration-300
                shadow-[0_0_12px_rgba(56,189,248,0.4)]
              "
            >
              <ThumbsUp className="size-4" />
              <span className="text-sm font-medium">{faq.upvotes}</span>
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
