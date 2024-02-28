import { Navbar } from "@/components/layout/(landing)/navbar";
import { Footer } from "@/components/layout/(landing)/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container flex flex-col flex-1 py-10">{children}</main>
      <Footer />
    </>
  );
}
