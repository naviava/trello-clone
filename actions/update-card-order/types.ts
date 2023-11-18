import { z } from "zod";
import { Card } from "@prisma/client";

import { UpdateCardOrderSchema } from "./schema";
import { ActionState } from "~/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateCardOrderSchema>;
export type ReturnType = ActionState<InputType, Card[]>;
