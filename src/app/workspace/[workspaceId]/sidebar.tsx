import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { Bell, HomeIcon, MessagesSquare, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside
      className="
        w-[72px] 
        h-full 
        flex flex-col 
        items-center 
        gap-y-5 
        py-4 
        bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#0c0c0c]
        border-r border-white/10
        shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]
      "
    >
      {/* Top Section */}
      <div className="flex flex-col items-center gap-y-3">
        <WorkspaceSwitcher />

        <SidebarButton
          icon={HomeIcon}
          label="Home"
          isActive={pathname.includes("/workspace")}
        />
        <SidebarButton icon={MessagesSquare} label="DMs" />
        <SidebarButton icon={Bell} label="Activity" />
        <SidebarButton icon={MoreHorizontal} label="More" />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center justify-center mt-auto pt-3 border-t border-white/10">
        <UserButton />
      </div>
    </aside>
  );
};
