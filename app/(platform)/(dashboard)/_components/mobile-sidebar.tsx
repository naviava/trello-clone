"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";

import { useIsMounted } from "~/hooks/use-is-mounted";
import { useMobileSideBar } from "~/hooks/use-mobile-sidebar";

import { Button } from "~/components/ui/button";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import Sidebar from "./sidebar";

export default function MobileSidebar() {
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const { isOpen, onOpen, onClose } = useMobileSideBar();

  useEffect(() => onClose(), [pathname, onClose]);

  if (!isMounted) return null;

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={onOpen}
        className="mr-2 block md:hidden"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
}
