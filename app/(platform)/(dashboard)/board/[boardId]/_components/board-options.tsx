"use client";

import { memo, useCallback } from "react";

import { toast } from "sonner";
import { MoreHorizontal, X } from "lucide-react";

import { useAction } from "~/hooks/use-action";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";

import { deleteBoard } from "~/actions/delete-board";

interface Props {
  id: string;
}

export const BoardOptions = memo(_BoardOptions);
function _BoardOptions({ id }: Props) {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => toast.error(error),
    onSuccess: () => toast.success("Board deleted"),
  });

  const handleDelete = useCallback(() => execute({ id }), [execute, id]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="transparent" className="h-auto w-auto p-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">
          Actions
        </div>
        <PopoverClose asChild>
          <Button
            variant="ghost"
            className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          disabled={isLoading}
          onClick={handleDelete}
          className="h-auto w-full justify-start rounded-none p-2 px-5 text-sm font-normal"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
}
