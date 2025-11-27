"use client";

import { useState } from "react";
import { ChevronDown, ListFilter, SquarePen, Users, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { InviteModal } from "./invite-modal";
import { PreferencesModal } from "./preferences-modal";
import { Doc } from "../../../../convex/_generated/dataModel";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      {/* Invite Modal */}
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />

      {/* Preferences Modal */}
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 h-[49px] bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-b border-white/10 shadow-sm">
        {/* Workspace Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="font-semibold text-base text-white hover:bg-white/10 px-2 py-1 flex items-center gap-1 transition-all duration-150"
              size="sm"
            >
              <span className="truncate">{workspace.name}</span>
              <ChevronDown className="size-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="bottom"
            align="start"
            className="w-64 bg-[#181818] border-white/10 text-gray-200 shadow-xl backdrop-blur-md"
          >
            <DropdownMenuLabel className="text-xs text-gray-400 uppercase tracking-wide">
              Workspace
            </DropdownMenuLabel>

            {/* Workspace Info */}
            <DropdownMenuItem className="cursor-default hover:bg-transparent flex gap-3 py-3">
              <div className="size-9 flex items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg font-bold">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <p className="font-semibold">{workspace.name}</p>
                <p className="text-xs text-gray-400">Active workspace</p>
              </div>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator className="bg-white/10" />

                {/* Invite */}
                <DropdownMenuItem
                  onClick={() => setInviteOpen(true)}
                  className="cursor-pointer py-2 text-sm hover:bg-white/10 flex items-center gap-2"
                >
                  <Users className="size-4 text-purple-400" />
                  <span>Invite people</span>
                </DropdownMenuItem>

                {/* Preferences */}
                <DropdownMenuItem
                  onClick={() => setPreferencesOpen(true)}
                  className="cursor-pointer py-2 text-sm hover:bg-white/10 flex items-center gap-2"
                >
                  <Settings className="size-4 text-blue-400" />
                  <span>Preferences</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Actions (Filter / New Message) */}
        <div className="flex items-center gap-1.5">
          <Hint label="Filter conversations" side="bottom">
            <Button
              variant="ghost"
              size="icon-Sm"
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ListFilter className="size-4" />
            </Button>
          </Hint>

          <Hint label="New message" side="bottom">
            <Button
              variant="ghost"
              size="icon-Sm"
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};
