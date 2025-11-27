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
import { Switch } from "@/components/ui/switch";
import { useCreateRoom } from "../api/use-create-room";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateRoomModal } from "../store/use-create-room-modal";
import { toast } from "sonner";

export const CreateRoomModal = () => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateRoomModal();
  const { mutate, isPending } = useCreateRoom();

  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxMembers, setMaxMembers] = useState("");

  const handleClose = () => {
    setOpen(false);
    setName("");
    setTopic("");
    setDescription("");
    setIsPrivate(false);
    setMaxMembers("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !topic.trim()) {
      toast.error("Room name and topic are required");
      return;
    }

    mutate(
      {
        name: name.trim(),
        topic: topic.trim(),
        description: description.trim() || undefined,
        workspaceId,
        isPrivate,
        maxMembers: maxMembers ? parseInt(maxMembers) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Room created successfully");
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create room");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg rounded-2xl bg-gradient-to-br from-black via-gray-900 to-black border border-white/10 shadow-[0_0_30px_-5px_rgba(56,189,248,0.5)] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Create Discussion Room
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Room Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Product Planning"
              disabled={isPending}
              required
              className="bg-black/30 border-white/10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic" className="text-gray-300">Topic *</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Q1 2024 Strategy"
              disabled={isPending}
              required
              className="bg-black/30 border-white/10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this room about?"
              rows={3}
              disabled={isPending}
              className="resize-none bg-black/30 border-white/10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMembers" className="text-gray-300">Max Members (optional)</Label>
            <Input
              id="maxMembers"
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              placeholder="Leave empty for unlimited"
              disabled={isPending}
              min="2"
              className="bg-black/30 border-white/10 text-gray-300 placeholder:text-gray-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
            />
          </div>

          <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-cyan-600/5 backdrop-blur-sm">
            <div className="space-y-0.5">
              <Label htmlFor="private" className="text-gray-300">Private Room</Label>
              <p className="text-xs text-gray-500">
                Only invited members can join
              </p>
            </div>
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={isPending}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-cyan-600"
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
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
              disabled={isPending}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white border-0 shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
            >
              {isPending ? "Creating..." : "Create Room"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};