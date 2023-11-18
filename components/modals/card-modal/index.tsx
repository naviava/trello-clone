"use client";

import { useQuery } from "@tanstack/react-query";

import { CardWithList } from "~/types";

import { useCardModal } from "~/hooks/use-card-modal";

import { Dialog, DialogContent } from "~/components/ui/dialog";
import { Header, HeaderSkeleton } from "./header";

import { fetcher } from "~/lib/fetcher";

export function CardModal() {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <HeaderSkeleton /> : <Header data={cardData} />}
      </DialogContent>
    </Dialog>
  );
}
