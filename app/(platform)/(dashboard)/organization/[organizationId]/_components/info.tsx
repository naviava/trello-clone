"use client";

import { memo } from "react";
import Image from "next/image";

import { CreditCard } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";

import { Skeleton } from "~/components/ui/skeleton";

interface Props {
  isPro: boolean;
}

export const Info = memo(_Info);
function _Info({ isPro }: Props) {
  const { organization: org, isLoaded } = useOrganization();

  if (!isLoaded) {
    return <_Info.Skeleton />;
  }

  return (
    <div className="flex items-center gap-x-4">
      <div className="relative h-[60px] w-[60px]">
        <Image
          fill
          src={org?.imageUrl!}
          alt="Organization"
          className="rounded-md object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="text-xl font-semibold">{org?.name}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <CreditCard className="mr-1 h-3 w-3" />
          {isPro ? "Pro" : "Free"}
        </div>
      </div>
    </div>
  );
}

_Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="relative h-[60px] w-[60px]">
        <Skeleton className="absolute h-full w-full rounded-md" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex items-center">
          <Skeleton className="mr-2 h-4 w-4" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </div>
  );
};
