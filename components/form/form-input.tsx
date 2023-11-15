"use client";

import { forwardRef, memo } from "react";
import { useFormStatus } from "react-dom";

import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import FormErrors from "./form-errors";

import { cn } from "~/lib/utils";

interface Props {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
}

const FormInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      type,
      placeholder,
      required,
      disabled,
      errors,
      className,
      defaultValue = "",
      onBlur,
    },
    ref,
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {!!label ? (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Input
            ref={ref}
            id={id}
            name={id}
            type={type}
            disabled={pending || disabled}
            placeholder={placeholder}
            onBlur={onBlur}
            required={required}
            defaultValue={defaultValue}
            className={cn("h-7 px-2 py-1 text-sm", className)}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export default memo(FormInput);
