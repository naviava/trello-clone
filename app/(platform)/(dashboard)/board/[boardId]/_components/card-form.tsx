"use client";

import {
  ElementRef,
  KeyboardEventHandler,
  forwardRef,
  memo,
  useCallback,
  useRef,
} from "react";
import { useParams } from "next/navigation";

import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import { useAction } from "~/hooks/use-action";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { Button } from "~/components/ui/button";
import { FormSubmit } from "~/components/form/form-submit";
import { FormTextarea } from "~/components/form/form-textarea";

import { createCard } from "~/actions/create-card";

interface Props {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

const _CardForm = forwardRef<HTMLTextAreaElement, Props>(
  ({ listId, isEditing, disableEditing, enableEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape") disableEditing();
      },
      [disableEditing],
    );

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", handleKeyDown);

    const handleTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> =
      useCallback((e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          formRef.current?.requestSubmit();
        }
      }, []);

    const { execute, fieldErrors } = useAction(createCard, {
      onError: (error) => toast.error(error),
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" created`);
        formRef.current?.reset();
      },
    });

    const handleSubmit = useCallback(
      (formData: FormData) => {
        const title = formData.get("title") as string;
        const listId = formData.get("listId") as string;
        const boardId = params.boardId as string;

        execute({ title, listId, boardId });
      },
      [execute, params.boardId],
    );

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={handleSubmit}
          className="m-1 space-y-4 px-1 py-0.5"
        >
          <FormTextarea
            ref={ref}
            id="title"
            onKeyDown={handleTextareaKeyDown}
            placeholder="Enter a title for this card"
            errors={fieldErrors}
          />
          <input hidden id="listId" name="listId" value={listId} />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add card</FormSubmit>
            <Button size="sm" variant="ghost" onClick={disableEditing}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="px-2 pt-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={enableEditing}
          className="h-auto w-full justify-start px-2 py-1.5 text-sm text-muted-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add a card
        </Button>
      </div>
    );
  },
);

_CardForm.displayName = "CardForm";
export const CardForm = memo(_CardForm);
