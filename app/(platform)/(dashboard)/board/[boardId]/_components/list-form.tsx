"use client";

import { ElementRef, useCallback, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import { useAction } from "~/hooks/use-action";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { Button } from "~/components/ui/button";
import { FormInput } from "~/components/form/form-input";
import { FormSubmit } from "~/components/form/form-submit";
import { ListWrapper } from "./list-wrapper";

import { createList } from "~/actions/create-list";

interface Props {}

export function ListForm({}: Props) {
  const router = useRouter();
  const params = useParams<{ boardId: string }>();

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }, []);

  const disableEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const { execute, fieldErrors } = useAction(createList, {
    onError: (error) => toast.error(error),
    onSuccess: (data) => {
      toast.success(`List "${data.title}" created`);
      disableEditing();
      router.refresh();
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

  useEventListener("keydown", handleKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = useCallback(
    (formData: FormData) => {
      const title = formData.get("title") as string;
      const boardId = formData.get("boardId") as string;

      execute({ title, boardId });
    },
    [execute],
  );

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          action={onSubmit}
          className="w-full space-y-4 rounded-md bg-white p-3 shadow-md"
        >
          <FormInput
            ref={inputRef}
            id="title"
            errors={fieldErrors}
            placeholder="Enter list title"
            className="h-7 border-transparent px-2 py-1 text-sm font-medium transition hover:border-input focus:border-input"
          />
          <input hidden name="boardId" value={params.boardId} />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add List</FormSubmit>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={disableEditing}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="flex w-full items-center rounded-md bg-white/80 p-3 text-sm font-medium transition hover:bg-white/50"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add a list
      </button>
    </ListWrapper>
  );
}
