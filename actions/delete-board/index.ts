"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";

import { DeleteBoardSchema } from "./schema";
import { InputType, ReturnType } from "./types";

import { db } from "~/lib/db";
import { createSafeAction } from "~/lib/create-safe-action";

export async function handler(data: InputType): Promise<ReturnType> {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { id } = data;
  let board;

  try {
    board = await db.board.delete({
      where: { id, orgId },
    });
  } catch (error) {
    return { error: "Failed to delete board" };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
}

export const deleteBoard = createSafeAction(DeleteBoardSchema, handler);
