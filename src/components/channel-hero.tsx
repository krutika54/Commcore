"use client";
import { format } from "date-fns";
import { Hash, Sparkles } from "lucide-react";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  return (
    <div className="mt-24 mx-6 mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-lg p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10"></div>


      {/* Channel Name */}
      <h1 className="text-4xl font-bold text-white tracking-tight flex items-center mb-3">
        <span className="text-purple-500 mr-2">#</span>
        {name}
      </h1>

      {/* Description */}
      <div className="flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
        <p className="text-base text-gray-300 leading-relaxed">
          This channel was created on{" "}
          <span className="text-white font-semibold">
            {format(creationTime, "MMMM do, yyyy")}
          </span>
          . This marks the beginning of the{" "}
          <span className="text-purple-400 font-semibold">{name}</span> channel — the
          space where ideas start and collaboration grows.
        </p>
      </div>

      {/* Decorative bottom line */}
      <div className="mt-6 h-1 w-full bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 rounded-full"></div>
    </div>
  );
};