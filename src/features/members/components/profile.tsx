import { Button } from "@/components/ui/button";
import {Id} from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { AlertTriangle,  ChevronDownIcon,  Loader, MailIcon, XIcon, Shield, UserCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface ProfileProps{
    memberId:Id<"members">;
    onClose:()=>void;
};

export const Profile =({memberId, onClose}:ProfileProps)=>{

    const router = useRouter();

    const workspaceId = useWorkspaceId();

    const [UpdateDialog, confirmUpdate] = useConfirm(
        "Change role",
        "Are you sure you want to change this member's role"
    );

    const [LeaveDialog, confirmLeave] = useConfirm(
        "Leave workspace",
        "Are you sure you want to leave this workspace?"
    );

    const [RemoveDialog, confirmRemove] = useConfirm(
        "Remove member",
        "Are you sure you want to remove this member",
    );

    const{data: member, isLoading: isLoadingMember} = useGetMember({id:memberId});
    const {data:currentMember, isLoading: isLoadingCurrentMember}=useCurrentMember({workspaceId});





    const {mutate:updateMember, isPending:isUpdateMember} = useUpdateMember();
    const {mutate:removeMember, isPending:isRemoveMember} = useRemoveMember();

    const onRemove = async () =>{

        const ok = await confirmRemove();

        if(!ok) return;

        removeMember({id:memberId},{
            onSuccess:()=>{
                toast.success("Member removed");
                onClose();
            },

            onError:()=>{
                toast.error("Failed to remove member.");
            }
        })
    };


    const onLeave = async () =>{

        const ok = await confirmLeave();

        if(!ok) return;

        removeMember({id:memberId},{
            onSuccess:()=>{
                router.replace("/");
                toast.success("You left the workspace");
                onClose();
            },

            onError:()=>{
                toast.error("Failed to leave the workspace");
            }
        })
    };

    const onUpdate = async (role:"admin" | "member") =>{

        const ok = await confirmUpdate();
        if(!ok) return;
        updateMember({id:memberId, role},{
            onSuccess:()=>{
                toast.success("Role changed");
                onClose();
            },

            onError:()=>{
                toast.error("Failed to change role");
            }
        })
    };

    if(isLoadingMember || isLoadingCurrentMember){
       
        return(
             <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="h-[49px] flex justify-between items-center px-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                    <p className="text-lg font-bold text-white">Profile</p>
                    <Button onClick={onClose} size="icon-Sm" variant="ghost" className="hover:bg-gray-700">
                        <XIcon className="size-5 stroke-[1.5] text-gray-400"/>
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <Loader className="size-8 animate-spin text-purple-500" />
                    <p className="text-sm text-gray-400 mt-2">Loading profile...</p>
                </div>
            </div>
        );
    }

    if(!member){
        return(
            <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="h-[49px] flex justify-between items-center px-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                    <p className="text-lg font-bold text-white">Profile</p>
                    <Button onClick={onClose} size="icon-Sm" variant="ghost" className="hover:bg-gray-700">
                        <XIcon className="size-5 stroke-[1.5] text-gray-400"/>
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <div className="p-4 bg-red-500/10 rounded-full">
                        <AlertTriangle className="size-8 text-red-500" />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Profile not found</p>
                </div>
            </div>
        )
    }

    const avatarFallback = member.user.name?.[0] ?? "M";

    return(
        <>
        <RemoveDialog/>
        <LeaveDialog/>
        <UpdateDialog/>
        <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="h-[49px] flex justify-between items-center px-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                    <p className="text-lg font-bold text-white">Profile</p>
                    <Button onClick={onClose} size="icon-Sm" variant="ghost" className="hover:bg-gray-700">
                        <XIcon className="size-5 stroke-[1.5] text-gray-400"/>
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center p-6">
                    <div className="relative">
                        <Avatar className="h-32 w-32 border-4 border-purple-500/20 shadow-lg shadow-purple-500/20">
                            <AvatarImage src={member.user.image}/>
                            <AvatarFallback className="text-4xl font-semibold flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                        {member.role === "admin" && (
                            <div className="absolute -bottom-2 -right-2 p-2 bg-purple-500 rounded-full shadow-lg">
                                <Shield className="size-4 text-white" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <p className="text-xl font-bold text-white">{member.user.name}</p>
                        {member.role === "admin" && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-400 rounded-full">
                                Admin
                            </span>
                        )}
                    </div>
                    {currentMember?.role === "admin" &&
                     currentMember?._id !== memberId ? (
                        <div className="flex items-center gap-2 mt-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full capitalize bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white">
                                {member.role} <ChevronDownIcon className="size-4 ml-2"/>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full bg-gray-800 border-gray-700">
                              <DropdownMenuRadioGroup
                              value={member.role}
                              onValueChange={(role)=>onUpdate(role as "admin" | "member")}
                              >

                                <DropdownMenuRadioItem value="admin" className="text-gray-300 focus:bg-gray-700 focus:text-white">
                                   Admin
                                </DropdownMenuRadioItem>

                                <DropdownMenuRadioItem value="member" className="text-gray-300 focus:bg-gray-700 focus:text-white">
                                   Member
                                </DropdownMenuRadioItem>

                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                            </DropdownMenu>
                            <Button onClick={onRemove} variant="outline" className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                                Remove
                            </Button>
                        </div>

                    ) : currentMember?._id === memberId &&
                    currentMember?.role !== "admin" ? (
                        <div className="mt-4">
                            <Button onClick={onLeave} variant="outline" className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                                Leave
                            </Button>
                        </div>

                    ):null
                    }
                </div>
                <Separator className="bg-gray-700"/>
                <div className="flex flex-col p-4">
                    <p className="text-sm font-bold mb-4 text-gray-300">Contact information</p>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <MailIcon className="size-5 text-purple-500"/>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[13px] font-semibold text-gray-400">
                                Email Address
                            </p>
                            <Link
                            href={`mailto:${member.user.email}`}
                            className="text-sm hover:underline text-purple-400 hover:text-purple-300 transition-colors">
                                {member.user.email}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            </>
    );
};