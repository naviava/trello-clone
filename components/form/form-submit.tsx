"use client";

import { memo } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "~/components/ui/button";

interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "default"
    | "destructive"
    | "link"
    | "outline"
    | "ghost";
}
export const FormSubmit = memo(_FormSubmit);
function _FormSubmit({
  children,
  className,
  disabled,
  variant = "primary",
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      size="sm"
      variant={variant}
      disabled={pending || disabled}
      className={className}
    >
      {children}
    </Button>
  );
}
