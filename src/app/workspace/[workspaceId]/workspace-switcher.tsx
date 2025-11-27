
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateWorkspaceModal();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter(
    (w) => w?._id !== workspaceId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-9 relative overflow-hidden bg-gradient-to-br from-[#5E2C5F] to-[#2B0F2D] hover:from-[#7A3D7B] hover:to-[#3C1A3E] text-white font-semibold text-xl rounded-lg shadow-sm transition-all duration-200"
          variant="ghost"
        >
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name?.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="start"
        className="w-64 bg-[#141414] border border-white/10 shadow-lg rounded-md text-white/90 p-1 backdrop-blur-sm"
      >
        {/* Active workspace */}
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="cursor-pointer flex-col items-start gap-0.5 px-3 py-2 rounded-sm hover:bg-white/10 transition"
        >
          <p className="font-semibold text-white truncate">{workspace?.name}</p>
          <span className="text-xs text-white/50">Active workspace</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10 my-1" />

        {/* Other workspaces */}
        {filteredWorkspaces?.map((w) => (
          <DropdownMenuItem
            key={w._id}
            onClick={() => router.push(`/workspace/${w._id}`)}
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-white/10 transition"
          >
            <div className="size-8 flex items-center justify-center bg-[#5E2C5F] text-white font-semibold text-base rounded-md shrink-0">
              {w.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{w.name}</p>
          </DropdownMenuItem>
        ))}

        {/* Create new workspace */}
        <DropdownMenuSeparator className="bg-white/10 my-1" />
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-[#2D872A]/20 transition"
          onClick={() => setOpen(true)}
        >
          <div className="size-8 flex items-center justify-center bg-[#2D872A] text-white font-semibold text-lg rounded-md shrink-0">
            <Plus className="size-4" />
          </div>
          <p className="text-white/90">Create new workspace</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
