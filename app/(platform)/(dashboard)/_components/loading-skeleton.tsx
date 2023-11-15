import { Skeleton } from "~/components/ui/skeleton";
import { SkeletonNavItem } from "./nav-item";

export function LoadingSkeleton() {
  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <Skeleton className="h-10 w-[50%]" />
        <Skeleton className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <SkeletonNavItem />
        <SkeletonNavItem />
        <SkeletonNavItem />
      </div>
    </>
  );
}
