"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";

import { db } from "~/lib/db";
import { CreateBoardSchema } from "./schema";
import { createSafeAction } from "~/lib/create-safe-action";

async function handler(data: InputType): Promise<ReturnType> {
  const { userId } = auth();
  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title } = data;
  let board;

  try {
    board = await db.board.create({
      data: { title },
    });
  } catch (err) {
    return {
      error: "Failed to create board",
    };
  }

  revalidatePath(`/boards/${board.id}`);
  return { data: board };
}

export const createBoard = createSafeAction(CreateBoardSchema, handler);
