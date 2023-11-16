"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";

import { UpdateBoardSchema } from "./schema";
import { InputType, ReturnType } from "./types";

import { db } from "~/lib/db";
import { createSafeAction } from "~/lib/create-safe-action";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { title, id } = data;
  let board;

  try {
    board = await db.board.update({
      where: { id, orgId },
      data: { title },
    });
  } catch (error) {
    return { error: "Failed to update board" };
  }

  revalidatePath(`/organization/${orgId}`);
  return { data: board };
}

export const updateBoard = createSafeAction(UpdateBoardSchema, handler);
