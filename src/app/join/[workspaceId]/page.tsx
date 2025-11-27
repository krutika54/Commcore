

"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import VerificationInput from "react-verification-input";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { Loader } from "lucide-react";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useJoin();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (value: string) => {
    mutate(
      { workspaceId, joinCode: value.toLowerCase() },
      {
        onSuccess: (id) => {
          router.replace(`/workspace/${id}`);
          toast.success("Workspace joined");
        },
        onError: () => {
          toast.error("Failed to join workspace");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <Loader className="size-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Main Card */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-y-8 bg-white/10 backdrop-blur-md border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md text-center transition-all hover:scale-[1.02]">
        <Image
          src="/window.svg"
          width={70}
          height={70}
          alt="COMMCORE Logo"
          className="drop-shadow-lg"
        />

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
            Join {data?.name}
          </h1>
          <p className="text-sm text-gray-400">
            Enter the 6-digit code to join this workspace.
          </p>
        </div>

        <VerificationInput
          onComplete={handleComplete}
          length={6}
          autoFocus
          classNames={{
            container: cn(
              "flex gap-x-3 justify-center",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-12 w-10 rounded-md border border-gray-700 bg-black/40 text-gray-300 flex items-center justify-center text-lg font-semibold shadow-inner focus:outline-none",
            characterInactive: "bg-black/20 text-gray-600",
            characterSelected: "bg-purple-500/30 text-white border-purple-400",
            characterFilled: "bg-blue-500/30 text-white border-blue-400",
          }}
        />

        <div className="flex gap-x-4">
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-gray-700 hover:border-purple-500 hover:text-purple-400 transition-colors"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
