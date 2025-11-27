import data from "@emoji-mart/data";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";


import{
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import{
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";



interface EmojiPopoverProps{
    children: React.ReactNode;
    hint? : string;
    onEmojiSelect:(emoji:string)=> void;
};

export const EmojiPropover=({
    children,
    hint = "Emoji",
    onEmojiSelect,

}:EmojiPopoverProps)=>{
   
    const [popoverOpen, setPopoverOpen]= useState(false);
    const [tooltipOpen, setTooltipOpen]= useState(false);

    const onSelect = (value:EmojiClickData)=>{
        onEmojiSelect(value.emoji);
        setPopoverOpen(false);

        setTimeout(()=>{
            setTooltipOpen(false);
        },500)
    }

    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip 
                open={tooltipOpen}
                onOpenChange={setTooltipOpen}
                delayDuration={50}
                >
                <PopoverTrigger asChild>
                 <TooltipTrigger asChild>
                    {children}
                 </TooltipTrigger>
                 </PopoverTrigger>
                 <TooltipContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
                    <p className="font-medium text-xs">{hint}</p>
                 </TooltipContent>
                
                </Tooltip>
                  
                  <PopoverContent className="p-0 w-full border border-gray-700 shadow-xl bg-gray-800">
                    <EmojiPicker 
                      onEmojiClick={onSelect}
                      theme={Theme.DARK}
                      searchPlaceHolder="Search emoji..."
                      previewConfig={{
                        showPreview: false
                      }}
                    />

                  </PopoverContent>

            </Popover>
        </TooltipProvider>
    );
};