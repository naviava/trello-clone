"use client";

import { ElementRef, memo, useCallback, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { Layout } from "lucide-react";

import { useAction } from "~/hooks/use-action";
import { useQueryClient } from "@tanstack/react-query";

import { CardWithList } from "~/types";

import { FormInput } from "~/components/form/form-input";
import { Skeleton } from "~/components/ui/skeleton";

import { updateCard } from "~/actions/update-card";
import { toast } from "sonner";

interface Props {
  data: CardWithList;
}

export const Header = memo(_Header);
function _Header({ data }: Props) {
  const params = useParams();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(data.title);
  const inputRef = useRef<ElementRef<"input">>(null);

  const { execute, fieldErrors } = useAction(updateCard, {
    onError: (error) => toast.error(error),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      toast.success(`Card renamed to "${data.title}"`);
      setTitle(data.title);
    },
  });

  const onBlur = useCallback(() => {
    inputRef.current?.form?.requestSubmit();
  }, []);

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const boardId = params.boardId as string;
      const title = formData.get("title") as string;

      if (title === data.title) return;
      execute({ boardId, title, id: data.id });
    },
    [execute, data.id, params.boardId, data.title],
  );

  return (
    <div className="mb-6 flex w-full items-start gap-x-3">
      <Layout className="mt-1 h-5 w-5 text-neutral-700" />
      <div className="w-full">
        <form action={handleSubmit}>
          <FormInput
            ref={inputRef}
            id="title"
            onBlur={onBlur}
            defaultValue={title}
            errors={fieldErrors}
            className="relative -left-1.5 mb-0.5 w-[95%] truncate border-transparent bg-transparent px-1 text-xl font-semibold text-neutral-700 focus-visible:border-input focus-visible:bg-white"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{data.list.title}</span>
        </p>
      </div>
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="mb-6 flex items-center gap-x-3">
      <Skeleton className="mt-1 h-6 w-6 bg-neutral-200" />
      <div>
        <Skeleton className="mb-1 h-6 w-24 bg-neutral-200" />
        <Skeleton className="h-4 w-12 bg-neutral-200" />
      </div>
    </div>
  );
}
