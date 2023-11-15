"use client";

import { memo, useCallback, useMemo } from "react";
import Link from "next/link";

import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { Organization } from "~/types";

import { Button } from "~/components/ui/button";
import { Accordion } from "~/components/ui/accordion";
import { LoadingSkeleton } from "./loading-skeleton";
import { NavItem } from "./nav-item";

interface Props {
  storageKey?: string;
}

export const Sidebar = memo(_Sidebar);
function _Sidebar({ storageKey = "t-sidebar-state" }: Props) {
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {},
  );

  const { organization: activeOrg, isLoaded: hasLoadedOrg } = useOrganization();
  const { userMemberships, isLoaded: hasLoadedOrgList } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  const defaultAccordionValue = useMemo(
    () =>
      Object.keys(expanded).reduce((acc: string[], key: string) => {
        if (!!expanded[key]) {
          acc.push(key);
        }
        return acc;
      }, []),
    [expanded],
  );

  const toggleExpand = useCallback(
    (id: string) => {
      setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    },
    [setExpanded],
  );

  if (!hasLoadedOrg || !hasLoadedOrgList || userMemberships.isLoading) {
    return (
      <>
        <LoadingSkeleton />
      </>
    );
  }

  return (
    <>
      <div className="mb-1 flex items-center text-xs font-medium">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships.data.map(({ organization: org }) => (
          <NavItem
            key={org.id}
            org={org as Organization}
            isExpanded={!!expanded[org.id]}
            isActive={activeOrg?.id === org.id}
            onExpand={toggleExpand}
          />
        ))}
      </Accordion>
    </>
  );
}
