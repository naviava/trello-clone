"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";

import { UpdateCardSchema } from "./schema";
import { InputType, ReturnType } from "./types";

import { db } from "~/lib/db";
import { createSafeAction } from "~/lib/create-safe-action";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { id, boardId, ...values } = data;
  let card;

  try {
    card = await db.card.update({
      where: {
        id,
        list: {
          board: { orgId },
        },
      },
      data: { ...values },
    });
  } catch (error) {
    return { error: "Failed to update card" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}

export const updateCard = createSafeAction(UpdateCardSchema, handler);
