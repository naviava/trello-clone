"use client";

import { ElementRef, memo, useCallback, useRef, useState } from "react";

import { Draggable, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "~/types";

import { ListHeader } from "./list-header";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";

import { cn } from "~/lib/utils";

interface Props {
  idx: number;
  data: ListWithCards;
}

export const ListItem = memo(_ListItem);
function _ListItem({ data, idx }: Props) {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = useCallback(() => setIsEditing(false), []);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus());
  }, []);

  return (
    <Draggable draggableId={data.id} index={idx}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-full w-[272px] shrink-0 select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md"
          >
            <ListHeader data={data} onAddCard={enableEditing} />
            <Droppable droppableId={data.id} type="card">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "mx-1 flex flex-col gap-y-2 px-1 py-0.5",
                    data.cards.length > 0 ? "mt-2" : "mt-0",
                  )}
                >
                  {data.cards.map((card, idx) => (
                    <CardItem key={card.id} idx={idx} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              ref={textareaRef}
              listId={data.id}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}
