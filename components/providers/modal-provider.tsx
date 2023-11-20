"use client";

import { useIsMounted } from "~/hooks/use-is-mounted";

import { ProModal } from "~/components/modals/pro-modal";
import { CardModal } from "~/components/modals/card-modal";

export function ModalProvider() {
  const isMounted = useIsMounted();
  if (!isMounted) return null;

  return (
    <>
      <CardModal />
      <ProModal />
    </>
  );
}
