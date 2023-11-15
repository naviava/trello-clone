import { useFormStatus } from "react-dom";
import { deleteBoard } from "~/actions/delete-board";
import { Button } from "~/components/ui/button";
import DeleteButton from "./delete-button";

interface Props {
  id: string;
  title: string;
}

export default function Board({ id, title }: Props) {
  const deleteBoardById = deleteBoard.bind(null, id);

  return (
    <form action={deleteBoardById} className="flex items-center gap-x-2">
      <p>Board title: {title}</p>
      <DeleteButton />
    </form>
  );
}
