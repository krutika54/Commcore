"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTask } from "../api/use-delete-task";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

interface DeleteTaskModalProps {
  taskId: Id<"tasks">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteTaskModal = ({
  taskId,
  open,
  onOpenChange,
}: DeleteTaskModalProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useDeleteTask();

  const handleDelete = () => {
    mutate(
      { taskId },
      {
        onSuccess: () => {
          toast.success("Task deleted successfully");
          router.push(`/workspace/${workspaceId}/tasks`);
        },
        onError: () => {
          toast.error("Failed to delete task");
        },
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="
          max-w-md
          bg-gradient-to-br from-black via-gray-900 to-black
          backdrop-blur-xl
          border border-white/10
          text-white
          shadow-[0_0_40px_-10px_rgba(147,51,234,0.4)]
          rounded-2xl
          transition-all duration-300
          hover:shadow-[0_0_50px_-5px_rgba(239,68,68,0.5)]
        "
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            className="
              text-2xl font-extrabold 
              bg-gradient-to-r from-red-400 via-pink-400 to-purple-400
              bg-clip-text text-transparent
              tracking-wide drop-shadow-lg
              text-center
            "
          >
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription
            className="
              text-gray-400 text-center leading-relaxed
              mt-2
            "
          >
            This action cannot be undone. It will permanently delete the task
            along with all its discussions and attachments.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex justify-end gap-3 mt-6">
          <AlertDialogCancel
            disabled={isPending}
            className="
              border border-purple-500/40 text-purple-300
              bg-transparent
              hover:bg-purple-600/20 hover:text-white
              transition-all duration-300
            "
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="
              bg-gradient-to-r from-red-600 via-pink-500 to-purple-500 
              text-white font-semibold
              hover:shadow-[0_0_20px_rgba(239,68,68,0.7)]
              transition-all duration-300
            "
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
