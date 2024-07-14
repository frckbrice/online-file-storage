/**
 * this file continue the action from http.ts file.
 */

"use node";

// import type { WebhookEvent } from "@clerk/nextjs/server";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { v } from "convex/values";
import { Webhook } from "svix";

import { internalAction } from "./_generated/server";
import { headers } from "next/headers";

/** this webhook come from convex dashboard .env variable */
const webhookServer = process.env.CLERK_WEBHOOK_SECRET ?? ``;

/** this action is used to verify the webhook is internal and only be call by mutation, query and action internal to your system. it is also used for third party interaction */
export const fulfill = internalAction({
    args: {
        headers: v.any(),
        payload: v.string()
    },
    handler: async (ctx, args) => {
        // const signature = args.headers.get('stripe-signature') as string;
        // const event: WebhookEvent = await webhook.constructEvent(args.payload, signature, 'stripe');
        const webhook = new Webhook(webhookServer);
        const payload = webhook.verify(args.payload, args.headers) as WebhookEvent;
        return payload;
    }
});
