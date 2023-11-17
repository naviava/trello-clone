"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";

import { CreateListSchema } from "./schema";
import { InputType, ReturnType } from "./types";

import { db } from "~/lib/db";
import { createSafeAction } from "~/lib/create-safe-action";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { title, boardId } = data;
  let list;

  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board) {
      return { error: "Board not found" };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: { title, boardId, order: newOrder },
    });
  } catch (error) {
    return { error: "Failed to create list" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
}

export const createList = createSafeAction(CreateListSchema, handler);