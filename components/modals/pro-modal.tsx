"use client";

import { useCallback } from "react";
import Image from "next/image";

import { toast } from "sonner";

import { useAction } from "~/hooks/use-action";
import { useProModal } from "~/hooks/use-pro-modal";

import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";

import { stripeRedirect } from "~/actions/stripe-redirect";

interface Props {}

export function ProModal({}: Props) {
  const proModal = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onError: (error) => toast.error(error),
    onSuccess: (data) => (window.location.href = data),
  });

  const handleUpgradeRequest = useCallback(() => {
    execute({});
  }, [execute]);

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="relative flex aspect-video items-center justify-center">
          <Image fill src="/hero.svg" alt="Hero" className="object-cover" />
        </div>
        <div className="mx-auto space-y-6 p-6 text-neutral-700">
          <h2 className="text-xl font-semibold">
            Upgrade to EZFlow Pro today!
          </h2>
          <p className="text-xs font-semibold text-neutral-600">
            Explore the best of EZFlow
          </p>
          <div className="pl-3">
            <ul className="list-disc text-sm">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>And more!</li>
            </ul>
          </div>
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={handleUpgradeRequest}
            className="w-full"
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
