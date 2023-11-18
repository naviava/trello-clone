"use client";

import { memo } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import { useCardModal } from "~/hooks/use-card-modal";

interface Props {
  idx: number;
  data: Card;
}

export const CardItem = memo(_CardItem);
function _CardItem({ data, idx }: Props) {
  const openCardModal = useCardModal((state) => state.onOpen);

  return (
    <Draggable draggableId={data.id} index={idx}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => openCardModal(data.id)}
          className="truncate rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm shadow-sm hover:border-black"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
}
