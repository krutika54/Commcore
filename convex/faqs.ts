import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Get FAQs by workspace
export const getByWorkspace = query({
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

    let faqsQuery = ctx.db
      .query("faqs")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId));

    if (args.channelId) {
      faqsQuery = ctx.db
        .query("faqs")
        .withIndex("by_channel_id", (q) => q.eq("channelId", args.channelId));
    }

    const faqs = await faqsQuery.order("desc").collect();

    const faqsWithCreators = await Promise.all(
      faqs.map(async (faq) => {
        const creator = await ctx.db.get(faq.createdBy);
        const user = creator ? await ctx.db.get(creator.userId) : null;

        return {
          ...faq,
          creator: creator ? { ...creator, user } : null,
        };
      })
    );

    // Sort pinned first, then by upvotes
    return faqsWithCreators.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.upvotes - a.upvotes;
    });
  },
});

// Create FAQ
export const create = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
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

    const faqId = await ctx.db.insert("faqs", {
      question: args.question,
      answer: args.answer,
      workspaceId: args.workspaceId,
      channelId: args.channelId,
      createdBy: member._id,
      upvotes: 0,
      isPinned: false,
      createdAt: Date.now(),
    });

    return faqId;
  },
});

// Upvote FAQ
export const upvote = mutation({
  args: { faqId: v.id("faqs") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const faq = await ctx.db.get(args.faqId);
    if (!faq) throw new Error("FAQ not found");

    await ctx.db.patch(args.faqId, {
      upvotes: faq.upvotes + 1,
    });

    return args.faqId;
  },
});

// Toggle pin FAQ
export const togglePin = mutation({
  args: { faqId: v.id("faqs") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const faq = await ctx.db.get(args.faqId);
    if (!faq) throw new Error("FAQ not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", faq.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Only admins can pin FAQs");
    }

    await ctx.db.patch(args.faqId, {
      isPinned: !faq.isPinned,
    });

    return args.faqId;
  },
});

// Delete FAQ
export const remove = mutation({
  args: { faqId: v.id("faqs") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const faq = await ctx.db.get(args.faqId);
    if (!faq) throw new Error("FAQ not found");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", faq.workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member) throw new Error("Unauthorized");

    // Only creator or admin can delete
    if (faq.createdBy !== member._id && member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.faqId);

    return args.faqId;
  },
});
