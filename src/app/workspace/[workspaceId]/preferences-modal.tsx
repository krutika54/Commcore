import { useState } from "react";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action is irreversible."
  );

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Workspace removed");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to remove workspace");
        },
      }
    );
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      {
        id: workspaceId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success("Workspace updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gradient-to-b from-gray-950 to-gray-900 border border-gray-800/70 text-gray-200 overflow-hidden rounded-xl shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <DialogHeader className="p-4 border-b border-gray-800/70 bg-gray-900/70 backdrop-blur-md">
            <DialogTitle className="text-lg font-semibold text-gray-100 tracking-wide">
              {value}
            </DialogTitle>
          </DialogHeader>

          {/* Body */}
          <div className="px-4 pb-4 flex flex-col gap-y-3">
            {/* Rename Section */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-gray-900/50 rounded-lg border border-gray-800/70 cursor-pointer hover:bg-gray-800/60 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-200">
                      Workspace name
                    </p>
                    <p className="text-sm text-purple-400 hover:text-purple-300 font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 truncate">
                    {value}
                  </p>
                </div>
              </DialogTrigger>

              <DialogContent className="bg-gradient-to-b from-gray-950 to-gray-900 border border-gray-800/70 text-gray-200 shadow-lg backdrop-blur-md">
                <DialogHeader>
                  <DialogTitle className="text-gray-100 font-semibold">
                    Rename this workspace
                  </DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                    className="bg-gray-900/70 border border-gray-800 text-gray-100 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-purple-500"
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={isUpdatingWorkspace}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      disabled={isUpdatingWorkspace}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Delete Section */}
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className="flex items-center gap-x-2 px-5 py-4 bg-gray-900/50 border border-gray-800/70 rounded-lg cursor-pointer hover:bg-rose-600/10 text-rose-500 transition-all duration-200"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm font-semibold">Delete Workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
