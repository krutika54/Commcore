import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetActiveTasksProps {
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
}

export const useGetActiveTasks = ({ workspaceId, channelId }: UseGetActiveTasksProps) => {
  const data = useQuery(api.tasks.getActiveTasks, { workspaceId, channelId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
