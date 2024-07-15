import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// we add index to help query data related to the organization
// one way to add second field is clear the table and then add the second field in the schema
// another way is to set the second field as optional, run the migration  and remove the second field optional wrapper if needed : v.optional(v.string()) 
export default defineSchema({
    files: defineTable({
        name: v.string(),
        organizationId: v.string(),
        fileId: v.id("_storage"),
    })
        .index("by_orgId", ["organizationId"]),
    users: defineTable({
        tokenIdentifier: v.string(),
        orgIds: v.array(v.string()),
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
