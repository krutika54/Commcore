
 


"use client";

import { Button } from "@/components/ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConfirm } from "@/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Regenerate Invite Code?",
    "This will deactivate the current invite code and generate a new one."
  );

  const { mutate, isPending } = useNewJoinCode();

  const handleNewCode = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => toast.success("Invite code regenerated successfully"),
        onError: () => toast.error("Failed to regenerate invite code"),
      }
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-[#0d0d0d] border border-white/10 text-gray-200 shadow-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-semibold text-white">
              Invite people to{" "}
              <span className="text-purple-400 font-bold">{name}</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Share the code below to invite members to your workspace.
            </DialogDescription>
          </DialogHeader>

          {/* Invite Code Box */}
          <div className="flex flex-col items-center justify-center py-10 space-y-4 border border-white/10 bg-black/50 backdrop-blur-sm">
            <p className="text-5xl font-extrabold tracking-widest text-white select-all">
              {joinCode}
            </p>
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <CopyIcon className="size-4 mr-2" />
              Copy Invite Link
            </Button>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between w-full pt-4">
            <Button
              onClick={handleNewCode}
              variant="outline"
              disabled={isPending}
              className="flex items-center gap-2 border-white/20 text-gray-300 hover:text-purple-400 hover:border-purple-400 transition-all"
            >
              <RefreshCcw className="size-4" />
              New Code
            </Button>
            <DialogClose asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition-all">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
