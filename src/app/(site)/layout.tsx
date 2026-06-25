import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import Aurora from "@/components/visual/Aurora";
import SmoothScroll from "@/components/providers/SmoothScroll";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      <Aurora />
      <div
        aria-hidden
        className="noise pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
      />
      <PageLoader />
      <Navbar />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
