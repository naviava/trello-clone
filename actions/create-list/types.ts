import { z } from "zod";
import { List } from "@prisma/client";

import { CreateListSchema } from "./schema";
import { ActionState } from "~/lib/create-safe-action";

export type InputType = z.infer<typeof CreateListSchema>;
export type ReturnType = ActionState<InputType, List>;
