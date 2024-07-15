import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, MutationCtx, QueryCtx, } from "./_generated/server";

/** we create a helper function */
export async function getUser(ctx: QueryCtx | MutationCtx, tokenIdentifier: string) {

    const user = await ctx.db
        .query('users')
        .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', tokenIdentifier))
        .first();

    if (!user) {
        throw new ConvexError("user not found");
    }
    return user;
}

// the internal method is called from the mutations to the model in the server side after webhooks have been triggered
export const createUser = internalMutation({
    args: { tokenIdentifier: v.string() },
    async handler(ctx, args) {
        await ctx.db.insert('users', {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: [],
        })
    },
})

export const addOrgIdToUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        organizationId: v.string(),
    },
    async handler(ctx, args) {
        const user = await getUser(ctx, args.tokenIdentifier);
        user.orgIds = [...user.orgIds, args.organizationId];
        await ctx.db.patch(user._id, user);
    }
})
