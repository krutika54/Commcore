import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetTaskHistoryProps {
  workspaceId: Id<"workspaces">;
}

export const useGetTaskHistory = ({ workspaceId }: UseGetTaskHistoryProps) => {
  const data = useQuery(api.tasks.getTaskHistory, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
