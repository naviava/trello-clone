import { OrganizationSwitcher, auth } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { createBoard } from "~/actions/create-board";
import { db } from "~/lib/db";
import Board from "./_components/board";
import Form from "./_components/form";

interface Props {
  params: { organizationId: string };
}

export default async function OrganizationIdPage({ params }: Props) {
  const boards = await db.board.findMany();

  return (
    <div>
      <Form />
      <div className="space-y-2">
        {boards.map((board) => (
          <Board key={board.id} title={board.title} id={board.id} />
        ))}
      </div>
    </div>
  );
}
