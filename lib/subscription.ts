import { auth } from "@clerk/nextjs";
import { db } from "~/lib/db";

const DAY_IN_MS = 86_400_000;

export async function checkSubscription() {
  const { orgId } = auth();
  if (!orgId) return false;

  const orgSubscription = await db.orgSubscription.findFirst({
    where: { orgId },
    select: {
      stripeSubscriptionId: true,
      stripeCustomerId: true,
      stripeCurrentPeriodEnd: true,
      stripePriceId: true,
    },
  });

  if (!orgSubscription) return false;

  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
}
