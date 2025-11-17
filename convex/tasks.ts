import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Get workspace members for assignment dropdown
export const getWorkspaceMembers = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const membersWithUsers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user,
        };
      })
    );

    return membersWithUsers;
  },
});

// Get active tasks (not archived)
export const getActiveTasks = query({
  args: { 
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return null;

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_workspace_id_is_archived", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("isArchived", false)
      )
      .collect();

    const tasksWithData = await Promise.all(
      tasks.map(async (task) => {
        const creator = await ctx.db.get(task.createdBy);
        const creatorUser = creator ? await ctx.db.get(creator.userId) : null;
        
        const assignee = task.assignedTo ? await ctx.db.get(task.assignedTo) : null;
        const assigneeUser = assignee ? await ctx.db.get(assignee.userId) : null;

        return {
          ...task,
          creator: creator ? { ...creator, user: creatorUser } : null,
          assignee: assignee ? { ...assignee, user: assigneeUser } : null,
        };
      })
    );

    return tasksWithData;
  },
});

// Get task history (archived completed tasks)
export const getTaskHistory = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) return null;

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_workspace_id_is_archived", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("isArchived", true)
      )
      .collect();

    const tasksWithData = await Promise.all(
      tasks.map(async (task) => {
        const creator = await ctx.db.get(task.createdBy);
        const creatorUser = creator ? await ctx.db.get(creator.userId) : null;
        
        const assignee = task.assignedTo ? await ctx.db.get(task.assignedTo) : null;
        const assigneeUser = assignee ? await ctx.db.get(assignee.userId) : null;

        return {
          ...task,
          creator: creator ? { ...creator, user: creatorUser } : null,
          assignee: assignee ? { ...assignee, user: assigneeUser } : null,
        };
      })
    );

    return tasksWithData;
  },
});

// Create task with assignee
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    assignedTo: v.optional(v.id("members")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      createdBy: member._id,
      assignedTo: args.assignedTo,
      status: "not_started",
      priority: args.priority,
      dueDate: args.dueDate,
      isArchived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return taskId;
  },
});

// Update task status
export const updateStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delayed")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    // If completed, archive it
    const updates: any = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.status === "completed") {
      updates.completedAt = Date.now();
      updates.isArchived = true;
    }

    await ctx.db.patch(args.taskId, updates);

    return args.taskId;
  },
});

// Update task assignee
export const updateAssignee = mutation({
  args: {
    taskId: v.id("tasks"),
    assignedTo: v.optional(v.id("members")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    await ctx.db.patch(args.taskId, {
      assignedTo: args.assignedTo,
      updatedAt: Date.now(),
    });

    return args.taskId;
  },
});

// Delete task
export const remove = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    await ctx.db.delete(args.taskId);

    return args.taskId;
  },
});

// Get task comments
// ✅ CORRECT - Returns oldest first
export const getComments = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const comments = await ctx.db
      .query("taskComments")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .order("asc") // ✅ Changed from "desc" to "asc"
      .collect();

    return await Promise.all(
      comments.map(async (comment) => {
        const member = await ctx.db.get(comment.memberId);
        const user = member ? await ctx.db.get(member.userId) : null;

        return {
          ...comment,
          member: member ? { ...member, user } : null,
        };
      })
    );
  },
});


// Add comment to task
export const addComment = mutation({
  args: {
    taskId: v.id("tasks"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", task.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    const commentId = await ctx.db.insert("taskComments", {
      taskId: args.taskId,
      memberId: member._id,
      body: args.body,
      createdAt: Date.now(),
    });

    return commentId;
  },
});
// Get task by ID
export const getById = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const task = await ctx.db.get(args.taskId);
    if (!task) return null;

    const creator = await ctx.db.get(task.createdBy);
    const creatorUser = creator ? await ctx.db.get(creator.userId) : null;
    
    const assignee = task.assignedTo ? await ctx.db.get(task.assignedTo) : null;
    const assigneeUser = assignee ? await ctx.db.get(assignee.userId) : null;

    return {
      ...task,
      creator: creator ? { ...creator, user: creatorUser } : null,
      assignee: assignee ? { ...assignee, user: assigneeUser } : null,
    };
  },
});
// Get task attachments
export const getAttachments = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const attachments = await ctx.db
      .query("taskAttachments")
      .withIndex("by_task_id", (q) => q.eq("taskId", args.taskId))
      .order("desc")
      .collect();

    return await Promise.all(
      attachments.map(async (attachment) => ({
        ...attachment,
        url: await ctx.storage.getUrl(attachment.fileId),
      }))
    );
  },
});


// Add attachment
export const addAttachment = mutation({
  args: {
    taskId: v.id("tasks"),
    name: v.string(),
    fileId: v.id("_storage"),
    fileType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", task.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    const attachmentId = await ctx.db.insert("taskAttachments", {
      taskId: args.taskId,
      memberId: member._id,
      name: args.name,
      fileId: args.fileId,
      fileType: args.fileType,
      fileSize: args.fileSize,
      createdAt: Date.now(),
    });

    return attachmentId;
  },
});

// Remove attachment
export const removeAttachment = mutation({
  args: { attachmentId: v.id("taskAttachments") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const attachment = await ctx.db.get(args.attachmentId);
    if (!attachment) throw new Error("Attachment not found");

    await ctx.db.delete(args.attachmentId);
    await ctx.storage.delete(attachment.fileId);

    return args.attachmentId;
  },
});

