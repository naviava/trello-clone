import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "~/components/providers/modal-provider";
import { QueryProvider } from "~/components/providers/query-provider";

interface Props {
  children: React.ReactNode;
}

export default function PlatformLayout({ children }: Props) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
}
