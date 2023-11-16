import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { BoardNavbar } from "./_components/board-navbar";
import { db } from "~/lib/db";

interface Props {
  children: React.ReactNode;
  params: { boardId: string };
}

export async function generateMetadata({ params }: Props) {
  const { orgId } = auth();

  if (!orgId) {
    return { title: "Board" };
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  return { title: board?.title || "Board" };
}

export default async function BoardIdLayout({ children, params }: Props) {
  const { orgId } = auth();
  if (!orgId) return redirect("/select-org");

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) notFound();

  return (
    <div
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      className="relative h-full bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-black/10" />
      <BoardNavbar data={board} />
      <main className="relative h-full pt-28">{children}</main>
    </div>
  );
}
