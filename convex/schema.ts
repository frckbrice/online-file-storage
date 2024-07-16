import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileType = v.union(
    v.literal("image"),
    v.literal("csv"),
    v.literal("pdf"),
);

// we add index to help query data related to the organization "by_orgId"
// one way to add second field is clear the table and then add the second field in the schema
// another way is to set the second field as optional, run the migration  and remove the second field optional wrapper if needed i.e --> field : v.optional(v.string()) 
export default defineSchema({
    files: defineTable({
        name: v.string(),
        organizationId: v.string(),
        fileId: v.id("_storage"),
        // type: v.union(
        //     v.literal("image"),   can also support this.
        //     v.literal("video"),
        //     v.literal("document"),
        //     v.literal("audio"),
        //     v.literal("other"),
        // ),
        type: fileType
    })
        .index("by_orgId", ["organizationId"]),
    users: defineTable({
        tokenIdentifier: v.string(),
        orgIds: v.array(v.string()),
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
