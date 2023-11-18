"use client";

import { useFormStatus } from "react-dom";
import { KeyboardEventHandler, forwardRef, memo } from "react";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { FormErrors } from "./form-errors";

import { cn } from "~/lib/utils";

interface Props {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
  onBlur?: () => void;
  onClick?: () => void;
}

export const _FormTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      id,
      onClick,
      className,
      defaultValue,
      disabled,
      errors,
      label,
      onBlur,
      onKeyDown,
      placeholder,
      required,
    },
    ref,
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="w-full space-y-2">
        <div className="w-full space-y-1">
          {label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Textarea
            ref={ref}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            onClick={onClick}
            id={id}
            name={id}
            required={required}
            disabled={pending || disabled}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className={cn(
              "resize-none shadow-sm outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              className,
            )}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  },
);

_FormTextarea.displayName = "FormTextarea";
export const FormTextarea = memo(_FormTextarea);
