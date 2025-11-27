"use client";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import { TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { ueRemoveChannel } from "@/features/channels/api/use-remove-channel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "You are about to delete this channel. This action is irreversible"
  );

  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);
  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    ueRemoveChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== "admin") return;
    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setValue(value);
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete the Channel");
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success("Channel updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      }
    );
  };

  return (
    <div className="bg-gray-900/80 border-b border-gray-800 h-[49px] flex items-center px-4 overflow-hidden backdrop-blur-md shadow-sm">
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-base font-semibold text-gray-100 px-2 overflow-hidden w-auto hover:text-white hover:bg-gray-800/60 transition-colors"
            size="sm"
          >
            <span className="truncate flex items-center">
              <span className="text-purple-400">#</span> {title}
              <FaChevronDown className="size-3 ml-2 opacity-60" />
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 bg-gray-900 border border-gray-800 rounded-xl text-gray-100 overflow-hidden">
          <DialogHeader className="p-4 border-b border-gray-800 bg-gray-850">
            <DialogTitle className="text-lg font-semibold text-gray-100">
              #{title}
            </DialogTitle>
          </DialogHeader>

          <div className="px-4 pb-4 flex flex-col gap-y-3">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-gray-800/50 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800/80 transition-all">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-200">
                      Channel name
                    </p>
                    {member?.role === "admin" && (
                      <p className="text-sm text-purple-400 hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1"># {title}</p>
                </div>
              </DialogTrigger>

              <DialogContent className="bg-gray-900 border border-gray-800 text-gray-100">
                <DialogHeader>
                  <DialogTitle className="text-gray-100">
                    Rename this Channel
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                  <Input
                    value={value}
                    disabled={isUpdatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                    className="bg-gray-800 border-gray-700 text-gray-100 focus-visible:ring-purple-500"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        disabled={isUpdatingChannel}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      disabled={isUpdatingChannel}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {member?.role === "admin" && (
              <button
                onClick={handleDelete}
                disabled={isRemovingChannel}
                className="flex items-center gap-x-3 px-5 py-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/80 text-rose-500 transition-all"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
