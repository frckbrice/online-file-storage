import { v } from "convex/values";
import { mutation, query } from './_generated/server';
import { getUser } from "./users";


// create a mutation to convex dB
export const createFile = mutation({
    args: {
        name: v.string(),
        organizationId: v.string(),
    },
    async handler(ctx, args) { // the context argument here gives the current app auth state. we can identify if there is logged in user and authorize the requests 
        const identity = await ctx.auth.getUserIdentity();
        // verify the existence of a user to allow the mutation action
        if (!identity)
            throw new Error("You must be logged in to perform this action");

        const user = await getUser(ctx, identity.tokenIdentifier);

        // check if the user is part of the organization before inserting new file's data
        if (!user.orgIds.includes(args.organizationId)) {
            throw new Error("You must be part of the organization to perform this action");
        }

        await ctx.db.insert('files', {
            name: args.name,
            organizationId: args.organizationId,
        })
    }
});

export const getFiles = query({
    args: {
        organizationId: v.string(),
    },
    async handler(ctx, args) {
        const id = await ctx.auth.getUserIdentity();
        // verify the existence of a user to allow the query action
        if (!id)
            return [];
        return ctx.db.query('files').withIndex('by_orgId', (q) => q.eq('organizationId', args.organizationId)).collect();
    }
})
