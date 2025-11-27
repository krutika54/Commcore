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
import { useCreateFaq } from "../api/use-create-faq";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateFaqModal } from "../store/use-create-faq-modal";
import { toast } from "sonner";

export const CreateFaqModal = () => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateFaqModal();
  const { mutate, isPending } = useCreateFaq();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleClose = () => {
    setOpen(false);
    setQuestion("");
    setAnswer("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer are required");
      return;
    }

    mutate(
      {
        question: question.trim(),
        answer: answer.trim(),
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("FAQ created successfully");
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create FAQ");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          max-w-2xl 
          bg-gradient-to-br from-black via-gray-900 to-black
          backdrop-blur-xl
          border border-white/10
          shadow-[0_0_40px_-10px_rgba(147,51,234,0.5)]
          text-white
          rounded-2xl
          transition-all
          duration-300
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
            💡 Create New FAQ
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-gray-300">
              Question <span className="text-red-500">*</span>
            </Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How can I reset my password?"
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

          <div className="space-y-2">
            <Label htmlFor="answer" className="text-gray-300">
              Answer <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Provide a detailed answer..."
              rows={6}
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
              {isPending ? "Creating..." : "Create FAQ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
