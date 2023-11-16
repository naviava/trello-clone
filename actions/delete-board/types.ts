import { z } from "zod";
import { Board } from "@prisma/client";

import { DeleteBoardSchema } from "./schema";
import { ActionState } from "~/lib/create-safe-action";

export type InputType = z.infer<typeof DeleteBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;
