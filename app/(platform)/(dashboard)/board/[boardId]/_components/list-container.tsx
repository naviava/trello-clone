"use client";

import { memo, useCallback, useEffect, useState } from "react";

import { toast } from "sonner";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "~/types";

import { useAction } from "~/hooks/use-action";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

import { updateListOrder } from "~/actions/update-list-order";
import { updateCardOrder } from "~/actions/update-card-order";

interface Props {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = memo(_ListContainer);
function _ListContainer({ boardId, data }: Props) {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onError: (error) => toast.error(error),
    onSuccess: () => {
      toast.success("List reordered successfully");
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onError: (error) => toast.error(error),
    onSuccess: () => {
      toast.success("Card reordered successfully");
    },
  });

  useEffect(() => setOrderedData(data), [data]);

  const handleDragEnd = useCallback(
    (result: any) => {
      const { destination, source, type } = result;
      if (!destination) return;

      // If dropped in the same position, do nothing.
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      // If user moves a list.
      if (type === "list") {
        const items = reorder(orderedData, source.index, destination.index).map(
          (item, idx) => ({ ...item, order: idx }),
        );
        setOrderedData(items);

        executeUpdateListOrder({ items, boardId });
      }

      // If user moves a card.
      if (type === "card") {
        let newOrderedData = [...orderedData];

        // Get source and destination list.
        const sourceList = newOrderedData.find(
          (list) => list.id === source.droppableId,
        );
        const destinationList = newOrderedData.find(
          (list) => list.id === destination.droppableId,
        );

        if (!sourceList || !destinationList) return;

        // Check if cards exist in source list.
        if (!sourceList.cards) {
          sourceList.cards = [];
        }

        // Check if cards exist in destination list.
        if (!destinationList.cards) {
          destinationList.cards = [];
        }

        // User moves card to same list.
        if (source.droppableId === destination.droppableId) {
          const reorderedCards = reorder(
            sourceList.cards,
            source.index,
            destination.index,
          );

          reorderedCards.forEach((card, idx) => {
            card.order = idx;
          });

          sourceList.cards = reorderedCards;
          setOrderedData(newOrderedData);

          executeUpdateCardOrder({
            boardId,
            items: reorderedCards,
          });

          // User moves card to different list.
        } else {
          // Rmove card from source list.
          const [movedCard] = sourceList.cards.splice(source.index, 1);

          // Assign new listId to moved card.
          movedCard.listId = destination.droppableId;

          // Add card to destination list.
          destinationList.cards.splice(destination.index, 0, movedCard);

          // Update order of cards in source list.
          sourceList.cards.forEach((card, idx) => {
            card.order = idx;
          });

          // Update order of cards in destination list.
          destinationList.cards.forEach((card, idx) => {
            card.order = idx;
          });

          setOrderedData(newOrderedData);

          executeUpdateCardOrder({
            boardId,
            items: destinationList.cards,
          });
        }
      }
    },
    [orderedData, boardId, executeUpdateListOrder, executeUpdateCardOrder],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex h-full gap-x-3"
          >
            {orderedData.map((list, idx) => (
              <ListItem key={list.id} idx={idx} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="w-1 flex-shrink-0" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
