import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Get all rooms in workspace
export const getByWorkspace = query({
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

    const rooms = await ctx.db
      .query("discussionRooms")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const roomsWithDetails = await Promise.all(
      rooms.map(async (room) => {
        const creator = await ctx.db.get(room.createdBy);
        const creatorUser = creator ? await ctx.db.get(creator.userId) : null;

        const members = await ctx.db
          .query("roomMembers")
          .withIndex("by_room_id", (q) => q.eq("roomId", room._id))
          .collect();

        const userMembership = await ctx.db
          .query("roomMembers")
          .withIndex("by_room_id_member_id", (q) =>
            q.eq("roomId", room._id).eq("memberId", member._id)
          )
          .unique();

        return {
          ...room,
          creator: creator ? { ...creator, user: creatorUser } : null,
          memberCount: members.length,
          isMember: !!userMembership,
        };
      })
    );

    return roomsWithDetails;
  },
});

// Get room by ID
export const getById = query({
  args: { roomId: v.id("discussionRooms") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const room = await ctx.db.get(args.roomId);
    if (!room) return null;

    const memberCount = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_id", (q) => q.eq("roomId", args.roomId))
      .collect();

    return {
      ...room,
      memberCount: memberCount.length,
    };
  },
});

// Create room
export const create = mutation({
  args: {
    name: v.string(),
    topic: v.string(),
    description: v.optional(v.string()),
    workspaceId: v.id("workspaces"),
    isPrivate: v.boolean(),
    maxMembers: v.optional(v.number()),
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

    const roomId = await ctx.db.insert("discussionRooms", {
      name: args.name,
      topic: args.topic,
      description: args.description,
      workspaceId: args.workspaceId,
      createdBy: member._id,
      isPrivate: args.isPrivate,
      maxMembers: args.maxMembers,
      createdAt: Date.now(),
    });

    // Auto-join creator
    await ctx.db.insert("roomMembers", {
      roomId,
      memberId: member._id,
      joinedAt: Date.now(),
    });

    return roomId;
  },
});

// Join room
export const join = mutation({
  args: { roomId: v.id("discussionRooms") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", room.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    // Check if already a member
    const existing = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_id_member_id", (q) =>
        q.eq("roomId", args.roomId).eq("memberId", member._id)
      )
      .unique();

    if (existing) return existing._id;

    // Check max members
    if (room.maxMembers) {
      const currentMembers = await ctx.db
        .query("roomMembers")
        .withIndex("by_room_id", (q) => q.eq("roomId", args.roomId))
        .collect();

      if (currentMembers.length >= room.maxMembers) {
        throw new Error("Room is full");
      }
    }

    const membershipId = await ctx.db.insert("roomMembers", {
      roomId: args.roomId,
      memberId: member._id,
      joinedAt: Date.now(),
    });

    return membershipId;
  },
});

// Get room messages
export const getMessages = query({
  args: { roomId: v.id("discussionRooms") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const room = await ctx.db.get(args.roomId);
    if (!room) return null;

    const messages = await ctx.db
      .query("roomMessages")
      .withIndex("by_room_id", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .take(100);

    const messagesWithMembers = await Promise.all(
      messages.map(async (message) => {
        const member = await ctx.db.get(message.memberId);
        const user = member ? await ctx.db.get(member.userId) : null;

        return {
          ...message,
          member: member ? { ...member, user } : null,
        };
      })
    );

    return messagesWithMembers.reverse();
  },
});

// Send message
export const sendMessage = mutation({
  args: {
    roomId: v.id("discussionRooms"),
    body: v.string(),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", room.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    // Check if member of room
    const membership = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_id_member_id", (q) =>
        q.eq("roomId", args.roomId).eq("memberId", member._id)
      )
      .unique();

    if (!membership) throw new Error("Not a member of this room");

    const messageId = await ctx.db.insert("roomMessages", {
      roomId: args.roomId,
      memberId: member._id,
      body: args.body,
      image: args.image,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Delete room
export const remove = mutation({
  args: { roomId: v.id("discussionRooms") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", room.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || room.createdBy !== member._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.roomId);

    return args.roomId;
  },
});
