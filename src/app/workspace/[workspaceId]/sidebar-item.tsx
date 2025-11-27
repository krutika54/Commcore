"use client";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sidebarItemVariants = cva(
  "flex items-center gap-2 justify-start font-medium text-sm h-9 px-3 rounded-md transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "text-gray-300 hover:text-white hover:bg-white/10 active:scale-[0.98]",
        active:
          "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-500/20 hover:bg-purple-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

export const SidebarItem = ({
  label,
  id,
  icon: Icon,
  variant,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  // Determine navigation path
  let href = `/workspace/${workspaceId}`;

  if (id === "tasks") href = `/workspace/${workspaceId}/tasks`;
  else if (id === "knowledge") href = `/workspace/${workspaceId}/knowledge`;
  else if (id === "rooms") href = `/workspace/${workspaceId}/rooms`;
  else if (id !== "threads" && id !== "drafts")
    href = `/workspace/${workspaceId}/channel/${id}`;

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={cn(sidebarItemVariants({ variant }), "group w-full")}
    >
      <Link href={href}>
        <Icon
          className={cn(
            "size-4 mr-2 shrink-0 transition-transform duration-200 group-hover:scale-110",
            variant === "active" ? "text-purple-400" : "text-gray-400"
          )}
        />
        <span className="truncate">{label}</span>
      </Link>
    </Button>
  );
};
