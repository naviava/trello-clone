"use client";

import { memo, useCallback } from "react";

import { toast } from "sonner";

import { useAction } from "~/hooks/use-action";
import { useProModal } from "~/hooks/use-pro-modal";

import { Button } from "~/components/ui/button";

import { stripeRedirect } from "~/actions/stripe-redirect";

interface Props {
  isPro: boolean;
}

export const SubscriptionButton = memo(_SubscriptionButton);
function _SubscriptionButton({ isPro }: Props) {
  const proModal = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onError: (error) => toast.error(error),
    onSuccess: (data) => {
      window.location.href = data;
    },
  });

  const handleClick = useCallback(() => {
    if (isPro) execute({});
    else proModal.onOpen();
  }, [execute, isPro, proModal]);

  return (
    <Button variant="primary" onClick={handleClick}>
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
}
