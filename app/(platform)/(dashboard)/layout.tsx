import Navbar from "./_components/navbar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="h-full">
      <Navbar />
      {children}
    </div>
  );
}
