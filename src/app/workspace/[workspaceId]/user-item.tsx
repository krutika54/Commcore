import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const userItemVariants = cva(
  "flex items-center gap-2 justify-start font-medium h-8 px-3 text-sm overflow-hidden transition-all",
  {
    variants: {
      variant: {
        default:
          "text-white/80 hover:text-white bg-transparent hover:bg-white/5 border-l-2 border-transparent hover:border-[#9b5de5]",
        active:
          "text-white bg-[#1a1a1a] border-l-2 border-[#9b5de5] hover:bg-[#1e1e1e]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({
  id,
  label = "Member",
  image,
  variant,
}: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(userItemVariants({ variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-6 rounded-none mr-2 border border-white/10 bg-[#111]">
          <AvatarImage
            src={image}
            alt={label}
            className="object-cover rounded-none"
          />
          <AvatarFallback className="bg-[#9b5de5] h-full w-full text-white text-xs rounded-none">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-xs sm:text-sm tracking-wide">
          {label}
        </span>
      </Link>
    </Button>
  );
};
