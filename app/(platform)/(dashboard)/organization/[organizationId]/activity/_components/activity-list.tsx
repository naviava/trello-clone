import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import { Skeleton } from "~/components/ui/skeleton";
import { ActivityItem } from "~/components/activity-item";

import { db } from "~/lib/db";

interface Props {}

export async function ActivityList({}: Props) {
  const { orgId } = auth();
  if (!orgId) return redirect("/select-org");

  const auditLogs = await db.auditLog.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ol className="mt-4 space-y-4">
      <p className="hidden text-center text-xs text-muted-foreground last:block">
        No activity found inside this organization.
      </p>
      {auditLogs.map((log) => (
        <ActivityItem key={log.id} data={log} />
      ))}
    </ol>
  );
}

ActivityList.Skeleton = function ActivitySkeleton() {
  return (
    <ol className="mt-4 space-y-4">
      <Skeleton className="h-14 w-[80%]" />
      <Skeleton className="h-14 w-[50%]" />
      <Skeleton className="h-14 w-[70%]" />
      <Skeleton className="h-14 w-[80%]" />
      <Skeleton className="h-14 w-[75%]" />
    </ol>
  );
};
