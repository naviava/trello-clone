"use server";

import { revalidatePath } from "next/cache";

import { auth, currentUser } from "@clerk/nextjs";

import { StripeRedirectSchema } from "./schema";
import { InputType, ReturnType } from "./types";

import { db } from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { absoluteUrl } from "~/lib/utils";
import { createSafeAction } from "~/lib/create-safe-action";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();
  const user = await currentUser();

  if (!userId || !orgId || !user) {
    return { error: "Unauthorized" };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);
  let url = "";

  try {
    const orgSubscription = await db.orgSubscription.findFirst({
      where: { orgId },
    });

    // If subsciption exists.
    if (!!orgSubscription && !!orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });
      url = stripeSession.url;
    }
    // If subscription does not exist.
    else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "EZFlow Pro",
                description: "Unlimited boards for your organization.",
              },
              unit_amount: 2000,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        metadata: { orgId },
      });
      url = stripeSession.url || "";
    }
  } catch {
    return { error: "Something went wrong" };
  }

  revalidatePath(`/organization/${orgId}`);
  return { data: url };
}

export const stripeRedirect = createSafeAction(StripeRedirectSchema, handler);
