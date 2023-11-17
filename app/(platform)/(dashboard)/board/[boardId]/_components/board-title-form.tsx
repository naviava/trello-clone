"use client";

import {
  ElementRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { toast } from "sonner";

import { Board } from "@prisma/client";

import { useAction } from "~/hooks/use-action";

import { Button } from "~/components/ui/button";
import { FormInput } from "~/components/form/form-input";

import { updateBoard } from "~/actions/update-board";

interface Props {
  data: Board;
}

export const BoardTitleForm = memo(_BoardTitleForm);
function _BoardTitleForm({ data }: Props) {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const { execute } = useAction(updateBoard, {
    onError: (error) => toast.error(error),
    onSuccess: (data) => {
      disableEditing();
      setTitle(data.title);
      toast.success(`Board "${data.title}" updated`);
    },
  });

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, []);

  const disableEditing = useCallback(() => setIsEditing(false), []);

  const onBlur = useCallback(() => {
    formRef.current?.requestSubmit();
  }, []);

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const title = formData.get("title") as string;
      execute({ id: data.id, title });
    },
    [data.id, execute],
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") disableEditing();
      console.log("Pressed");
    }

    const inputElement = inputRef.current;
    inputElement?.addEventListener("keydown", handleKeyDown);

    return () => {
      inputElement?.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (isEditing) {
    return (
      <form
        ref={formRef}
        action={handleSubmit}
        className="flex items-center gap-x-2"
      >
        <FormInput
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="h-7 border-none bg-transparent px-[7px] py-1 text-lg font-bold focus-visible:outline-none focus-visible:ring-transparent"
        />
      </form>
    );
  }

  return (
    <Button
      variant="transparent"
      onClick={enableEditing}
      className="h-auto w-auto p-1 px-2 text-lg font-bold"
    >
      {title}
    </Button>
  );
}
