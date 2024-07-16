import { v } from "convex/values";
import { mutation, query } from './_generated/server';
import { getUser } from "./users";
import { fileType } from "./schema";

/** generate the upload url where the file will be stored
 * The upload URL expires in 1 hour and so should be fetched shortly before the upload is made.
 */
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});



// create a mutation to convex dB
export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        organizationId: v.string(),
        type: fileType
    },
    async handler(ctx, args) { // the context argument here gives the current app auth state. we can identify if there is logged in user and authorize the requests 
        const identity = await ctx.auth.getUserIdentity();
        // verify the existence of a user to allow the mutation action
        if (!identity)
            throw new Error("You must be logged in to perform this action");

        // get the current user or organization
        const user = await getUser(ctx, identity.tokenIdentifier);

        // check if the user is part of the organization before inserting new file's data.
        if (!user.orgIds.includes(args.organizationId)) {
            throw new Error("You must be part of the organization to perform this action");
        }

        await ctx.db.insert('files', {
            name: args.name,
            organizationId: args.organizationId,
            fileId: args.fileId,
            type: args.type
        })
    }
});

//query to get the file url
export const getFileUrl = query({
    args: { fileId: v.id("_storage"), organizationId: v.string() },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        // verify the existence of a user to allow the mutation action
        if (!identity)
            throw new Error("You must be logged in to perform this action");
        const user = await getUser(ctx, identity.tokenIdentifier);

        // check if the user is part of the organization before inserting new file's data.
        if (!user.orgIds.includes(args.organizationId)) {
            throw new Error("You must be part of the organization to delete this file");
        }
        return await ctx.storage.getUrl(args.fileId);
    }
})

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


// mutation to delete file

export const deleteFile = mutation({
    args: { fileId: v.id("files"), },
    async handler(ctx, args) { // the context argument here gives the current app auth state. we can identify if there is logged in user and authorize the requests 
        const identity = await ctx.auth.getUserIdentity();
        // verify the existence of a user to allow the mutation action
        if (!identity)
            throw new Error("You must be logged in to perform this action");

        // get the current user or organization
        const user = await getUser(ctx, identity.tokenIdentifier);

        // check first if the file exists
        const existingFile = await ctx.db.get(args.fileId);
        if (!existingFile) {
            throw new Error("File not found");
        }

        // check if the user is part of the organization before inserting new file's data.
        if (!user.orgIds.includes(existingFile.organizationId)) {
            throw new Error("You must be part of the organization to delete this file");
        }
        // finally delete the file from DB.
        await ctx.db.delete(args.fileId);
    }
});
