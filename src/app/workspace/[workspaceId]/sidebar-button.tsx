"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { cn } from "@/lib/utils";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

export const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
}: SidebarButtonProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-y-1 cursor-pointer group transition-all duration-200",
        isActive ? "scale-[1.05]" : "hover:scale-[1.08]"
      )}
    >
      <Button
        variant="ghost"
        className={cn(
          "size-9 p-2 rounded-md bg-black/40 border border-white/10 shadow-sm transition-all duration-200",
          "hover:bg-purple-500/20 hover:border-purple-400/30",
          isActive && "bg-purple-500/25 border-purple-400/40 shadow-purple-500/30"
        )}
      >
        <Icon
          className={cn(
            "size-5 text-white transition-transform duration-200",
            "group-hover:scale-110",
            isActive && "text-purple-400"
          )}
        />
      </Button>

      <span
        className={cn(
          "text-[11px] font-medium tracking-wide transition-colors duration-200",
          isActive ? "text-purple-400" : "text-gray-400 group-hover:text-white"
        )}
      >
        {label}
      </span>
    </div>
  );
};
