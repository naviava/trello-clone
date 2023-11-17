"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";

import { DeleteListSchema } from "./schema";
import { InputType, ReturnType } from "./types";

import { db } from "~/lib/db";
import { createSafeAction } from "~/lib/create-safe-action";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { id, boardId } = data;
  let list;

  try {
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: { orgId },
      },
    });
  } catch (error) {
    return { error: "Failed to delete list" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
}

export const deleteList = createSafeAction(DeleteListSchema, handler);
