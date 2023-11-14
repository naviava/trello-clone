import { ClerkProvider } from "@clerk/nextjs";

interface Props {
  children: React.ReactNode;
}

export default function PlatformLayout({ children }: Props) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
