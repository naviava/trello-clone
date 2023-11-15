"use client";

import { useFormStatus } from "react-dom";
import { Input } from "~/components/ui/input";

interface Props {
  errors?: {
    title?: string[];
  };
}

export default function FormInput({ errors }: Props) {
  const { pending } = useFormStatus();

  return (
    <div>
      <Input
        required
        type="text"
        id="title"
        name="title"
        disabled={pending}
        placeholder="Enter title"
      />
      {!!errors &&
      Object.keys(errors).length > 0 &&
      !!errors.title &&
      errors?.title.length > 0 ? (
        <div>
          {errors?.title.map((error: string) => (
            <p key={error} className="text-rose-500">
              {error}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
