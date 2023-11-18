import { z } from "zod";
import { Card } from "@prisma/client";

import { UpdateCardSchema } from "./schema";
import { ActionState } from "~/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateCardSchema>;
export type ReturnType = ActionState<InputType, Card>;
