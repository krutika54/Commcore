import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns";
import { ChevronRight } from "lucide-react";

interface ThreadBarProps{
    count?:number;
    image?:string;
    timestamp?:number;
    name?:string;
    onClick?:()=>void;
};

export const ThreadBar = ({
    count,
    image,
    name="Member",
    timestamp,
    onClick,
}:ThreadBarProps)=>{

    const avatarFallback = name.charAt(0).toUpperCase();

    if(!count || !timestamp || !image) return null;

    return(
        <button
        onClick={onClick}
        className="p-1 rounded-md hover:bg-gray-800/50 border border-transparent hover:border-purple-500/50 flex items-center justify-start group/thread-bar transition max-w-[600px]">

            <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="size-6 shrink-0 border border-gray-700">
                    <AvatarImage src={image}/>
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 h-full w-full to-purple-700 text-white text-xs font-semibold">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <span className="text-xs text-purple-400 hover:underline font-bold truncate">
                    {count} {count > 1 ? "replies":"reply"}
                </span>
                <span className="text-xs text-gray-500 truncate group-hover/thread-bar:hidden block">
                Last reply {formatDistanceToNow(timestamp,{addSuffix:true})}
                </span>
                <span className="text-xs text-gray-400 truncate group-hover/thread-bar:block hidden">
                    View thread
                </span>
            </div>
            <ChevronRight className="size-4 text-gray-500 ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0"/>
        </button>
    )
};