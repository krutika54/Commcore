"use client";

import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onClick?: () => void;
}

export const Header = ({
  memberName = "Member",
  memberImage,
  onClick,
}: HeaderProps) => {
  const avatarFallback = memberName.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center justify-between h-[56px] px-4 border-b",
        "bg-gray-900/70 backdrop-blur-md border-gray-800 shadow-sm"
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="flex items-center gap-2 text-base font-semibold text-gray-100 hover:text-purple-400 transition-colors duration-200"
      >
        <Avatar className="size-8 border border-gray-700 shadow-sm">
          <AvatarImage src={memberImage} alt={memberName} />
          <AvatarFallback className="bg-gray-800 text-gray-300 text-sm">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>

        <span className="truncate">{memberName}</span>
        <FaChevronDown className="size-3 text-gray-500" />
      </Button>

      {/* Placeholder for future actions (like call, settings, etc.) */}
      <div className="flex items-center gap-2">
        {/* Future action buttons could go here */}
      </div>
    </div>
  );
};
