"use client";

import { useIsMounted } from "~/hooks/use-is-mounted";
import { CardModal } from "~/components/modals/card-modal";

export function ModalProvider() {
  const isMounted = useIsMounted();
  if (!isMounted) return null;

  return (
    <>
      <CardModal />
    </>
  );
}
