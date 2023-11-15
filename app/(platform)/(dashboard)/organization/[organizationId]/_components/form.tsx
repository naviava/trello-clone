"use client";

import { useAction } from "~/hooks/use-action";

import FormButton from "./form-button";
import FormInput from "./form-input";

import { createBoard } from "~/actions/create-board";

interface Props {}

export default function Form({}: Props) {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => console.log(data, "SUCCESS"),
    onError: (err) => console.log(err, "ERROR"),
  });

  function onSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    execute({ title });
  }

  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput errors={fieldErrors} />
      </div>
      <FormButton />
    </form>
  );
}
