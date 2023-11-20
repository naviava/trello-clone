"use client";

import { memo, useCallback } from "react";
import { useParams } from "next/navigation";

import { toast } from "sonner";
import { Copy, Trash } from "lucide-react";

import { CardWithList } from "~/types";

import { useAction } from "~/hooks/use-action";
import { useCardModal } from "~/hooks/use-card-modal";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

import { copyCard } from "~/actions/copy-card";
import { deleteCard } from "~/actions/delete-card";

interface Props {
  data: CardWithList;
}

export const Actions = memo(_Actions);
function _Actions({ data }: Props) {
  const params = useParams();
  const closeCardModal = useCardModal((state) => state.onClose);

  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onError: (error) => toast.error(error),
      onSuccess: (data) => {
        toast.success(`Card ${data.title} copied`);
        closeCardModal();
      },
    },
  );

  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onError: (error) => toast.error(error),
      onSuccess: (data) => {
        toast.success(`Card ${data.title} deleted`);
        closeCardModal();
      },
    },
  );

  const handleCopyCard = useCallback(() => {
    const boardId = params.boardId as string;
    executeCopyCard({ boardId, id: data.id });
  }, [data.id, params.boardId, executeCopyCard]);

  const handleDeleteCard = useCallback(() => {
    const boardId = params.boardId as string;
    executeDeleteCard({ boardId, id: data.id });
  }, [data.id, params.boardId, executeDeleteCard]);

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        variant="gray"
        size="inline"
        onClick={handleCopyCard}
        disabled={isLoadingCopy || isLoadingDelete}
        className="w-full justify-start"
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button
        variant="gray"
        size="inline"
        onClick={handleDeleteCard}
        disabled={isLoadingCopy || isLoadingDelete}
        className="w-full justify-start"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}

export function ActionsSkeleton() {
  return (
    <div className="mt-2 space-y-2">
      <Skeleton className="h-4 w-20 bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
    </div>
  );
}
