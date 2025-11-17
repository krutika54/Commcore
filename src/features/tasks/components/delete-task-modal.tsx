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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the task
            and all its discussions and attachments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
