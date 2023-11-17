"use client";

import { ListWithCards } from "~/types";
import { ListForm } from "./list-form";

interface Props {
  boardId: string;
  data: ListWithCards[];
}

export function ListContainer({ boardId, data }: Props) {
  return (
    <ol>
      <ListForm />
      <div className="w-1 flex-shrink-0" />
    </ol>
  );
}
