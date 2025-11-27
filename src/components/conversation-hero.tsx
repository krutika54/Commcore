import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Lock } from "lucide-react";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

export const ConversationHero = ({ name = "Member", image }: ConversationHeroProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase();

  return (
    <div className="mt-24 mx-6 mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-lg p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10"></div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-x-4 mb-4">
        <div className="relative">
          <Avatar className="size-20 border-4 border-purple-500/20 shadow-lg shadow-purple-500/20">
            <AvatarImage src={image} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-700 text-white text-2xl h-full w-full font-semibold flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 p-1.5 bg-green-500 rounded-full border-2 border-gray-900">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        <div>
          <p className="text-3xl font-bold text-white tracking-tight">
            {name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Active</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="flex items-start gap-2 bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
        <Lock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-300 leading-relaxed">
          This conversation is just between you and{" "}
          <span className="text-purple-400 font-semibold">{name}</span>. Messages here are private and secure.
        </p>
      </div>

      {/* Decorative bottom line */}
      <div className="mt-6 h-1 w-full bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 rounded-full"></div>
    </div>
  );
};