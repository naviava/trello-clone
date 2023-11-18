import { z } from "zod";
import { List } from "@prisma/client";

import { UpdateListOrderSchema } from "./schema";
import { ActionState } from "~/lib/create-safe-action";

export type InputType = z.infer<typeof UpdateListOrderSchema>;
export type ReturnType = ActionState<InputType, List[]>;
