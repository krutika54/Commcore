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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTask } from "../api/use-create-task";
import { useGetWorkspaceMembers } from "../api/use-get-workspace-members";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateTaskModal } from "../store/use-create-task-modal";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

export const CreateTaskModal = () => {
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateTaskModal();
  const { mutate, isPending } = useCreateTask();
  const { data: members } = useGetWorkspaceMembers({ workspaceId });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [dueDate, setDueDate] = useState("");

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignedTo("");
    setDueDate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        workspaceId,
        assignedTo: assignedTo ? (assignedTo as Id<"members">) : undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          handleClose();
        },
        onError: () => {
          toast.error("Failed to create task");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          max-w-lg 
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
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">
              Task Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
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
            <Label htmlFor="description" className="text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task details..."
              rows={3}
              disabled={isPending}
              className="
                bg-white/5 border border-white/10 
                text-white placeholder:text-gray-500
                focus:border-purple-400 focus:ring-purple-400
                transition-all duration-300
              "
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-gray-300">
                Priority *
              </Label>
              <Select
                value={priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setPriority(value)
                }
                disabled={isPending}
              >
                <SelectTrigger
                  id="priority"
                  className="
                    bg-white/5 border border-white/10 
                    text-white focus:border-blue-400 focus:ring-blue-400
                    transition-all duration-300
                  "
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border border-white/10 text-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-gray-300">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isPending}
                className="
                  bg-white/5 border border-white/10 
                  text-white focus:border-cyan-400 focus:ring-cyan-400
                  transition-all duration-300
                "
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo" className="text-gray-300">
              Assign To
            </Label>
            <Select
              value={assignedTo}
              onValueChange={setAssignedTo}
              disabled={isPending}
            >
              <SelectTrigger
                id="assignedTo"
                className="
                  bg-white/5 border border-white/10 
                  text-white focus:border-purple-400 focus:ring-purple-400
                  transition-all duration-300
                "
              >
                <SelectValue placeholder="Select member (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border border-white/10 text-white">
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {members?.map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.user?.name || "Unknown"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
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
              {isPending ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
