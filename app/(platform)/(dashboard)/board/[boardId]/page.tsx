import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { ListContainer } from "./_components/list-container";
import { db } from "~/lib/db";

interface Props {
  params: { boardId: string };
}

export default async function BoardIdPage({ params }: Props) {
  const { orgId } = auth();
  if (!orgId) return redirect("/select-org");

  const lists = await db.list.findMany({
    where: {
      boardId: params.boardId,
      board: { orgId },
    },
    include: {
      cards: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="h-full overflow-x-auto p-4">
      <ListContainer boardId={params.boardId} data={lists} />
    </div>
  );
}
