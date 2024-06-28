import { v } from "convex/values";
import { mutation, query } from './_generated/server';


// create a mutation to convex dB
export const createFile = mutation({
    args: {
        name: v.string(),
    },
    async handler(ctx, args) { // the context ctx argument here gives the current app auth state. we can identify if there is logged in user and authorize the requests 
        const id = await ctx.auth.getUserIdentity();
        // verify the existence of a user to allow the mutation action
        if (!id)
            throw new Error("You must be logged in to perform this action");

        await ctx.db.insert('files', {
            name: args.name,
        })
    }
});

export const getFiles = query({
    args: {},
    async handler(ctx, args) {
        const id = await ctx.auth.getUserIdentity();
        // verify the existence of a user to allow the query action
        if (!id)
            return [];
        return ctx.db.query('files').collect();
    }
})