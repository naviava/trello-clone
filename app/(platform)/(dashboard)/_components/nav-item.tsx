"use client";

import { memo, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { Activity, CreditCard, Layout, Settings } from "lucide-react";

import { Organization } from "~/types";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

import { cn } from "~/lib/utils";

interface Props {
  isExpanded: boolean;
  isActive: boolean;
  org: Organization;
  onExpand: (id: string) => void;
}

export const NavItem = memo(_NavItem);
function _NavItem({ isActive, isExpanded, onExpand, org }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        label: "Boards",
        icon: <Layout className="mr-2 h-4 w-4" />,
        href: `/organization/${org.id}`,
      },
      {
        label: "Activity",
        icon: <Activity className="mr-2 h-4 w-4" />,
        href: `/organization/${org.id}/activity`,
      },
      {
        label: "Settings",
        icon: <Settings className="mr-2 h-4 w-4" />,
        href: `/organization/${org.id}/settings`,
      },
      {
        label: "Billing",
        icon: <CreditCard className="mr-2 h-4 w-4" />,
        href: `/organization/${org.id}/billing`,
      },
    ],
    [org.id],
  );

  const handleClick = useCallback(
    (href: string) => router.push(href),
    [router],
  );

  return (
    <AccordionItem value={org.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(org.id)}
        className={cn(
          "flex items-center gap-x-2 rounded-md p-1.5 text-start text-neutral-700 no-underline transition hover:bg-neutral-500/10 hover:no-underline",
          isActive &&
            !isExpanded &&
            "bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 hover:text-sky-700",
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="relative h-7 w-7">
            <Image
              fill
              src={org.imageUrl}
              alt="Organization"
              className="rounded-sm object-cover"
            />
          </div>
          <span className="text-sm font-medium">{org.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {routes.map((route) => (
          <Button
            key={route.href}
            size="sm"
            variant="ghost"
            onClick={() => handleClick(route.href)}
            className={cn(
              "mb-1 w-full justify-start pl-10 font-normal",
              pathname === route.href &&
                "bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 hover:text-sky-700",
            )}
          >
            {route.icon}
            {route.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export function SkeletonNavItem() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="relative h-10 w-10 shrink-0">
        <Skeleton className="absolute h-full w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
