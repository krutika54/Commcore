import{
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { XIcon } from "lucide-react";

interface ThumbnailProps{
    url: string|null|undefined;
};

export const Thumbnail =( {url}: ThumbnailProps)=>{
    if(!url) return null;


    return (
       <Dialog>
         <DialogTrigger>
            <div className="relative overflow-hidden max-w-[360px] border border-gray-700 rounded-lg my-2 cursor-zoom-in hover:border-purple-500/50 transition-colors">
          <img 
          src={url}
          alt="Message image"
          className="rounded-md object-cover size-full"/>
        </div>
         </DialogTrigger>
         <DialogContent className="max-w-[880px] border-none bg-gray-900/95 backdrop-blur-xl p-0 shadow-2xl">
            <DialogHeader className="p-4 pb-0">
                <DialogTitle className="text-lg font-bold text-white">
                    Message Image
                </DialogTitle>
            </DialogHeader>
            
            <div className="p-4">
                <img 
                src={url}
                alt="Message image"
                className="rounded-lg object-contain w-full max-h-[70vh]"/>
            </div>
         </DialogContent>
       </Dialog>
    );
};