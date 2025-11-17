import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetTaskCommentsProps {
  taskId: Id<"tasks">;
}

export const useGetTaskComments = ({ taskId }: UseGetTaskCommentsProps) => {
  const data = useQuery(api.tasks.getComments, { taskId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
