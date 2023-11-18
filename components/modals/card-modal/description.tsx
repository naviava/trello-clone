"use client";

import { memo, useState, useRef, ElementRef, useCallback } from "react";
import { useParams } from "next/navigation";

import { AlignLeft } from "lucide-react";

import { useAction } from "~/hooks/use-action";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { CardWithList } from "~/types";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { FormSubmit } from "~/components/form/form-submit";
import { FormTextarea } from "~/components/form/form-textarea";

import { updateCard } from "~/actions/update-card";
import { toast } from "sonner";

interface Props {
  data: CardWithList;
}

export const Description = memo(_Description);
function _Description({ data }: Props) {
  const params = useParams();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const { execute, fieldErrors } = useAction(updateCard, {
    onError: (error) => toast.error(error),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      toast.success(`Card ${data.title} updated`);
      disableEditing();
    },
  });

  const enableEditing = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus());
  }, []);

  const disableEditing = useCallback(() => setIsEditing(false), []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  }, []);

  useEventListener("keydown", handleKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const description = formData.get("description") as string;
      const boardId = params.boardId as string;

      execute({ id: data.id, description, boardId });
    },
    [params.boardId, data.id, execute],
  );

  return (
    <div className="flex w-full items-start gap-x-3">
      <AlignLeft className="mt-0.5 h-5 w-5 text-neutral-700" />
      <div className="w-full">
        <p className="mb-2 font-semibold text-neutral-700">Description</p>
        {isEditing ? (
          <form ref={formRef} action={handleSubmit} className="space-y-2">
            <FormTextarea
              ref={textareaRef}
              id="description"
              placeholder="Add a more detailed description..."
              defaultValue={data.description || undefined}
              errors={fieldErrors}
              className="mt-2 w-full"
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={disableEditing}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            role="button"
            onClick={enableEditing}
            className="min-h-[78px] rounded-md bg-neutral-200 px-3.5 py-3 text-sm font-medium"
          >
            {data.description || "Add a more detailed description"}
          </div>
        )}
      </div>
    </div>
  );
}

export function DescriptionSkeleton() {
  return (
    <div className="flex w-full items-start gap-x-3">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="mb-2 h-6 w-24 bg-neutral-200" />
        <Skeleton className="h-[78px] w-full bg-neutral-200" />
      </div>
    </div>
  );
}
