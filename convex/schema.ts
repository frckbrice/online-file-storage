import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileType = v.union(
    v.literal("image"),
    v.literal("csv"),
    v.literal("pdf"),
);

export const roles = v.union(v.literal("admin"), v.literal("member"));
/**
 *   // type: v.union(
        //     v.literal("image"),   can also support this.
        //     v.literal("video"),
        //     v.literal("document"),
        //     v.literal("audio"),
        //     v.literal("other"),
        // ),
 */

// we add index to help query data related to the organization "by_orgId"
// one way to add second field is clear the table and then add the second field in the schema
// another way is to set the second field as optional, run the migration  and remove the second field optional wrapper if needed i.e --> field : v.optional(v.string()) 
export default defineSchema({
    files: defineTable({
        name: v.string(),
        organizationId: v.string(), // thir org is the current connected account.
        fileId: v.id("_storage"),
        type: fileType
    })
        .index("by_orgId", ["organizationId"]),
    favorites: defineTable({
        fileId: v.id("files"), // relationship to files table
        userId: v.id("users"), // relationship to users table
        orgId: v.string(),  // limit to the current organization
    })
        .index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
    users: defineTable({
        tokenIdentifier: v.string(),
        orgIds: v.optional(v.array(
            v.object({
                orgId: v.string(),
                role: roles,
            })
        ),)
    })
        .index("by_tokenIdentifier", ["tokenIdentifier"]),
});
