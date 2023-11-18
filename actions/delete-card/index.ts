"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";

import { DeleteCardSchema } from "./schema";
import { InputType, ReturnType } from "./types";

import { db } from "~/lib/db";
import { createSafeAction } from "~/lib/create-safe-action";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { id, boardId } = data;
  let card;

  try {
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: { orgId },
        },
      },
    });
  } catch (error) {
    return { error: "Failed to delete card" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}

export const deleteCard = createSafeAction(DeleteCardSchema, handler);
