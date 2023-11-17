"use client";

import { useEffect, useState } from "react";

import { ListWithCards } from "~/types";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

interface Props {
  boardId: string;
  data: ListWithCards[];
}

export function ListContainer({ boardId, data }: Props) {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => setOrderedData(data), [data]);

  return (
    <ol className="flex h-full gap-x-3">
      {orderedData.map((list, idx) => (
        <ListItem key={list.id} idx={idx} data={list} />
      ))}
      <ListForm />
      <div className="w-1 flex-shrink-0" />
    </ol>
  );
}
