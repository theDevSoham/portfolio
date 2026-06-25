import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import EntryScreen from "@/components/EntryScreen";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";
import Aurora from "@/components/visual/Aurora";
import ScrollProgress from "@/components/visual/ScrollProgress";
import SmoothScroll from "@/components/providers/SmoothScroll";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SmoothScroll>
      {/* Reliably hidden; only revealed during genuine keyboard (Tab) navigation. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <EntryScreen />
      <Aurora />
      <div
        aria-hidden
        className="noise pointer-events-none fixed inset-0 -z-10 opacity-[0.04]"
      />
      <ScrollProgress />
      <PageLoader />
      <Navbar />
      <main id="main" className="min-h-[70vh]">{children}</main>
      <Footer />
      <KonamiEasterEgg />
    </SmoothScroll>
  );
}
