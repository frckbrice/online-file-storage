import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
    path: "/clerk",
    method: "POST",
    handler: httpAction(async (ctx, request) => {

        const payloadString = await request.text();
        const headerPayload = request.headers;

        try {
            /* check the validity of the webhook here. ths internl is created in clerk.ts */
            const result = await ctx.runAction(internal.clerk.fulfill, {
                payload: payloadString,
                headers: {
                    'svix-id': headerPayload.get('svix-id') ?? '',
                    'svix-timestamp': headerPayload.get('svix-timestamp') ?? '',
                    'svix-signature': headerPayload.get('svix-signature') ?? '',
                }
            });

            /** if the webhook is valid, we get the data from the webhook and run the mutation from users.ts file internally and that will store the user to DB*/
            switch (result.type) {
                case 'user.created':
                    await ctx.runMutation(internal.users.createUser, {
                        tokenIdentifier: `https://top-kid-17.clerk.accounts.dev|${result.data.id}`
                    })
                    break;
                case "organizationMembership.created":
                    await ctx.runMutation(internal.users.addOrgIdToUser, {
                        tokenIdentifier: `https://top-kid-17.clerk.accounts.dev|${result.data.public_user_data.user_id}`,
                        organizationId: result.data.organization.id
                    })
                    break;
                default:
                    console.log("unknown webhook type");
            }
            return new Response(null, {
                status: 200
            })
        } catch (error) {
            console.log(error);
            return new Response("webhook failed", {
                status: 400
            })
        }
    })
})

export default http;
