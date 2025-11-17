import {v} from "convex/values";
import {authTables} from "@convex-dev/auth/server";
import {defineSchema, defineTable} from "convex/server";

const schema = defineSchema({
  ...authTables,
  
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member"))
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
  })
    .index("by_workspace_id", ["workspaceId"]),
  
  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  })
    .index("by_workspace_id", ["workspaceId"]),
  
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ]),
  
  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),

  // IMPROVED TASKS
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    createdBy: v.id("members"),
    assignedTo: v.optional(v.id("members")), // NEW
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("delayed")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    isArchived: v.boolean(), // NEW
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"])
    .index("by_assigned_to", ["assignedTo"])
    .index("by_created_by", ["createdBy"])
    .index("by_status", ["status"])
    .index("by_workspace_id_is_archived", ["workspaceId", "isArchived"]),

  // NEW: Task comments
  taskComments: defineTable({
    taskId: v.id("tasks"),
    memberId: v.id("members"),
    body: v.string(),
    createdAt: v.number(),
  })
    .index("by_task_id", ["taskId"])
    .index("by_member_id", ["memberId"]),

  // NEW: Task attachments
  taskAttachments: defineTable({
    taskId: v.id("tasks"),
    memberId: v.id("members"),
    name: v.string(),
    fileId: v.id("_storage"),
    fileType: v.string(),
    fileSize: v.number(),
    createdAt: v.number(),
  })
    .index("by_task_id", ["taskId"])
    .index("by_member_id", ["memberId"]),

  // Keep existing Discussion Rooms
  discussionRooms: defineTable({
    name: v.string(),
    topic: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    createdBy: v.id("members"),
    isPrivate: v.boolean(),
    maxMembers: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_created_by", ["createdBy"]),

 roomMembers: defineTable({
  roomId: v.id("discussionRooms"),
  memberId: v.id("members"),
  joinedAt: v.number(),
  role: v.optional(v.string()), // ADD THIS
  isMuted: v.optional(v.boolean()), // ADD THIS
})
  .index("by_room_id", ["roomId"])
  .index("by_member_id", ["memberId"])
  .index("by_room_id_member_id", ["roomId", "memberId"]),

  roomMessages: defineTable({
    roomId: v.id("discussionRooms"),
    memberId: v.id("members"),
    body: v.string(),
    image: v.optional(v.id("_storage")),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_room_id", ["roomId"])
    .index("by_member_id", ["memberId"]),

  // Keep existing Knowledge Hub
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    createdBy: v.id("members"),
    tags: v.optional(v.array(v.string())),
    isPinned: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"])
    .index("by_created_by", ["createdBy"]),

  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    createdBy: v.id("members"),
    upvotes: v.number(),
    isPinned: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"])
    .index("by_created_by", ["createdBy"]),

  documents: defineTable({
    name: v.string(),
    fileId: v.id("_storage"),
    fileType: v.string(),
    fileSize: v.number(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    uploadedBy: v.id("members"),
    tags: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_channel_id", ["channelId"])
    .index("by_uploaded_by", ["uploadedBy"]),
});

export default schema;
