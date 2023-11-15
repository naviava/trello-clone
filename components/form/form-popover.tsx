"use client";

import { ElementRef, memo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { X } from "lucide-react";

import { useAction } from "~/hooks/use-action";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { FormSubmit } from "./form-submit";
import { FormPicker } from "./form-picker";
import { FormInput } from "./form-input";

import { createBoard } from "~/actions/create-board";

interface Props {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}
export const FormPopover = memo(_FormPopover);
function _FormPopover({
  children,
  align,
  side = "bottom",
  sideOffset = 0,
}: Props) {
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute, fieldErrors } = useAction(createBoard, {
    onError: (error) => {
      console.log({ error });
      toast.error(error);
    },
    onSuccess: (data) => {
      console.log({ data });
      toast.success("Board created successfully!");
      closeRef.current?.click();
      router.push(`/board/${data.id}`);
    },
  });

  const onSubmit = useCallback(
    (formData: FormData) => {
      const title = formData.get("title") as string;
      const image = formData.get("image") as string;

      execute({ title, image });
    },
    [execute],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className="w-80 pt-3"
      >
        <div className="text-center text-sm font-medium text-neutral-600">
          Create board
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            variant="ghost"
            className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
