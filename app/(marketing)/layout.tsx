import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

interface Props {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: Props) {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="bg-slate-100 pb-20 pt-40">{children}</main>
      <Footer />
    </div>
  );
}
