"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";

import { CreateCardSchema } from "./schema";
import { InputType, ReturnType } from "./types";

import { db } from "~/lib/db";
import { createSafeAction } from "~/lib/create-safe-action";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { title, boardId, listId } = data;
  let card;

  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: { orgId },
      },
    });

    if (!list) {
      return { error: "List not found" };
    }

    const lastCard = await db.card.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = !!lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });
  } catch (error) {
    return { error: "Failed to create card" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
}

export const createCard = createSafeAction(CreateCardSchema, handler);
