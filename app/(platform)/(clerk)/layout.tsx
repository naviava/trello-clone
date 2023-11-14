interface Props {
  children: React.ReactNode;
}

export default function ClerkLayout({ children }: Props) {
  return (
    <div className="flex h-full items-center justify-center">{children}</div>
  );
}
