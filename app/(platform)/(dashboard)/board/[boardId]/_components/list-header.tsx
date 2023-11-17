"use client";

import { ElementRef, useCallback, useRef, useState } from "react";

import { toast } from "sonner";

import { List } from "@prisma/client";

import { useAction } from "~/hooks/use-action";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { FormInput } from "~/components/form/form-input";
import { ListOptions } from "./list-options";

import { updateList } from "~/actions/update-list";

interface Props {
  data: List;
}

export function ListHeader({ data }: Props) {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select());
  }, []);

  const disableEditing = useCallback(() => setIsEditing(false), []);

  const { execute } = useAction(updateList, {
    onError: (error) => toast.error(error),
    onSuccess: (data) => {
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
      disableEditing();
    },
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    },
    [disableEditing],
  );

  const handleClickOutside = useCallback(() => {
    disableEditing();
    setTitle(inputRef.current?.value || data.title);
    formRef.current?.requestSubmit();
  }, [disableEditing, data.title]);

  useEventListener("keydown", handleKeyDown);
  useOnClickOutside(formRef, handleClickOutside);

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const title = formData.get("title") as string;
      const id = formData.get("id") as string;
      const boardId = formData.get("boardId") as string;

      if (title === data.title) return disableEditing();
      execute({ title, id, boardId });
    },
    [data.title, disableEditing, execute],
  );

  return (
    <div className="flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold">
      {isEditing ? (
        <form ref={formRef} action={handleSubmit} className="flex-1 px-[2px]">
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormInput
            ref={inputRef}
            id="title"
            defaultValue={title}
            placeholder="Enter list title..."
            className="h-7 truncate border-transparent bg-transparent px-[7px] py-1 text-sm font-medium transition hover:border-input focus:border-input focus:bg-white"
          />
          <button hidden type="submit" />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="h-7 w-full cursor-pointer border-transparent px-2.5 py-1 text-sm font-medium"
        >
          {title}
        </div>
      )}
      <ListOptions data={data} onAddCard={() => {}} />
    </div>
  );
}
