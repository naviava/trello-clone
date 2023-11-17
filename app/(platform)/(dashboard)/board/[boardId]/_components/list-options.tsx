"use client";

import { ElementRef, useCallback, useRef } from "react";

import { toast } from "sonner";
import { MoreHorizontal, X } from "lucide-react";

import { List } from "@prisma/client";

import { useAction } from "~/hooks/use-action";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { FormSubmit } from "~/components/form/form-submit";

import { copyList } from "~/actions/copy-list";
import { deleteList } from "~/actions/delete-list";

interface Props {
  data: List;
  onAddCard: () => void;
}

export function ListOptions({ data, onAddCard }: Props) {
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onError: (error) => toast.error(error),
    onSuccess: (data) => {
      toast.success(`Deleted "${data.title}"`);
      closeRef.current?.click();
    },
  });

  const { execute: executeCopy } = useAction(copyList, {
    onError: (error) => toast.error(error),
    onSuccess: (data) => {
      toast.success(`"${data.title}" copied`);
      closeRef.current?.click();
    },
  });

  const handleDelete = useCallback(
    (formData: FormData) => {
      const id = formData.get("id") as string;
      const boardId = formData.get("boardId") as string;

      executeDelete({ id, boardId });
    },
    [executeDelete],
  );

  const handleCopy = useCallback(
    (formData: FormData) => {
      const id = formData.get("id") as string;
      const boardId = formData.get("boardId") as string;

      executeCopy({ id, boardId });
    },
    [executeCopy],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto w-auto p-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="px-0 pb-3 pt-3">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">
          List Actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            variant="ghost"
            className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          onClick={onAddCard}
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
        >
          Add card...
        </Button>
        <form action={handleCopy}>
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormSubmit
            variant="ghost"
            className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          >
            Copy list...
          </FormSubmit>
        </form>
        <Separator />
        <form action={handleDelete}>
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormSubmit
            variant="ghost"
            className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
