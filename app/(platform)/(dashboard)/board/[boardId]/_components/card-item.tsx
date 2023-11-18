"use client";

import { memo } from "react";
import { Card } from "@prisma/client";

interface Props {
  idx: number;
  data: Card;
}

export const CardItem = memo(_CardItem);
function _CardItem({ data, idx }: Props) {
  return (
    <div
      role="button"
      className="truncate rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm shadow-sm hover:border-black"
    >
      {data.title}
    </div>
  );
}
