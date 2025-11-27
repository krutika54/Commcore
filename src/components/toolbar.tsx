import { Button } from "./ui/button";
import { Hint } from "./hint";
import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { EmojiPropover } from "./emoji-popover";

interface ToolbarProps{
    isAuthor : boolean;
    isPending: boolean;
    handleEdit: () =>void;
    handleThread:()=>void;
    handleDelete: ()=>void;
    handleReaction: (value:string)=>void;
    hideThreadButton?: boolean;
};



 export const Toolbar =({
    isAuthor,
    isPending,
    handleEdit,
    handleThread,
    handleDelete,
    handleReaction,
    hideThreadButton,

}: ToolbarProps) =>{
    return(
        <div className="absolute top-0 right-5">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border border-gray-700 bg-gray-800 rounded-md shadow-lg backdrop-blur-sm">
              <EmojiPropover
              hint="Add reaction"
              onEmojiSelect={(emoji) =>handleReaction(emoji)}>
                
                 <Button
                variant="ghost"
                size="icon-Sm"
                disabled={isPending}
                className="text-gray-400 hover:text-purple-400 hover:bg-gray-700"
                >
                <Smile className="size-4" />
                </Button>
                </EmojiPropover>
                {!hideThreadButton && (
                
                <Hint label="Reply in thread">
                    <Button
                    variant="ghost"
                    size="icon-Sm"
                    disabled={isPending}
                    onClick={handleThread}
                    className="text-gray-400 hover:text-purple-400 hover:bg-gray-700">
                    <MessageSquareTextIcon className="size-4" />
                    </Button>
                </Hint>
                )}

                {isAuthor && (
                 <Hint label="Edit message">
                    <Button
                variant="ghost"
                size="icon-Sm"
                disabled={isPending}
                onClick={handleEdit}
                className="text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                >
                <Pencil className="size-4" />
                </Button>
                 </Hint>
                    )}
                {isAuthor && (
                 <Hint label="Delete message">
                <Button
                variant="ghost"
                size="icon-Sm"
                disabled={isPending}
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-400 hover:bg-gray-700">
                <Trash className="size-4" />
                </Button>
                 </Hint> )}
            </div>
            
        </div>
    )
};