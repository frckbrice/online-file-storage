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
        query: v.optional(v.string()),
        favorite: v.optional(v.boolean())
    },
    async handler(ctx, args) {
        const id = await ctx.auth.getUserIdentity();
        // verify the existence of a user to allow the query action
        if (!id) {
            console.log("Not logged in");
            return;
        };

        // get the current user profile information
        const user = await getUser(ctx, id.tokenIdentifier);

        // if no user drop the request
        if (!user)
            return [];

        // get all files
        const files = await ctx.db.query('files').withIndex('by_orgId', (q) => q.eq('organizationId', args.organizationId)).collect();

        if (args.favorite) {
            // get favorites
            const favorites = await ctx.db
                .query("favorites")
                .withIndex("by_userId_orgId_fileId", (q) =>
                    q.eq("userId", user._id).eq("orgId", args.organizationId)
                )
                .collect();

            // get favorites from all the files
            return files.filter((file) =>
                favorites.some((favorite) => favorite.fileId === file._id)
            );
        }

        return args.query ? files.filter((file) => file.name.toLowerCase().includes(args.query?.toLowerCase() as string)) : files
    }
})


// mutation to delete file

export const deleteFile = mutation({
    args: {
        fileId: v.id("files"),

    },
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

// get the favorite files
export const getFavoriteFiles = query({
    args: { orgId: v.string() },
    async handler(ctx, args) {

        //authenticate the user first
        const id = await ctx.auth.getUserIdentity();
        // verify the existence of a user to allow the query action
        if (!id) return null;

        // get the current user profile information
        const user = await getUser(ctx, id.tokenIdentifier);

        // if no user drop the request
        if (!user)
            return [];

        const favorites = await ctx.db
            .query("favorites")
            .withIndex("by_userId_orgId_fileId", (q) =>
                q.eq("userId", user._id).eq("orgId", args.orgId)
            )
            .collect();

        return favorites;

    }
})

// create favorite if not exits and delete if exists
export const toggleFavorite = mutation({
    args: {
        fileId: v.id("files"),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        // verify the existence of the current connected user to allow the mutation action
        if (!identity)
            throw new Error("You must be logged in to perform this action");

        // get the user infor of he exists
        const user = await getUser(ctx, identity.tokenIdentifier);


        //check if the file already exist
        const file = await ctx.db.get(args.fileId);
        if (!file) {
            throw new Error("File not found");
        }

        // check if the user is part of the organization that own the file.
        if (!user.orgIds.includes(file.organizationId)) {
            throw new Error("You must be part of the organization to perform this action");
        }

        const existingFavorite = await ctx.db.query('favorites').withIndex('by_userId_orgId_fileId', (q) => q.eq('userId', user._id).eq('orgId', file.organizationId).eq('fileId', file._id)).first();

        if (existingFavorite) {
            await ctx.db.delete(existingFavorite._id);
        } else {
            await ctx.db.insert('favorites', { fileId: file._id, userId: user._id, orgId: file.organizationId });
        }
    }

})
