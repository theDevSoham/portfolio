import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";

export const metadata: Metadata = {
  title: "Soham Das - Portfolio",
  description:
    "Explore the portfolio of Soham Das — Full Stack Developer with expertise in Next.js, React, Node.js React Native, and modern web technologies. Building scalable apps, creative UI, and impactful digital products.",
  keywords: [
    "Soham Das",
    "Portfolio",
    "Full Stack Developer",
    "Next.js",
    "React",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "Web Development",
    "Frontend",
    "Backend",
  ],
  authors: [{ name: "Soham Das" }],
  creator: "Soham Das",
  openGraph: {
    title: "Soham Das - Portfolio",
    description:
      "Full Stack Developer specializing in building scalable applications with Next.js, React, Node.js., React Native + Expo and modern web infrastructure",
    url: "https://yourdomain.com",
    siteName: "Soham.dev",
    images: [
      {
        url: "/og-image.png", // replace with your OG image
        width: 1200,
        height: 630,
        alt: "Soham Das - Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soham Das - Portfolio",
    description:
      "Explore projects, skills, and case studies by Soham Das — Full Stack Developer.",
    images: ["/og-image.png"], // same OG image
    creator: "@your_twitter", // replace if you have one
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-black text-slate-300 antialiased">
        <PageLoader />
        <header className="sticky top-0 backdrop-blur z-50 border-b lg:mb-20 mb-10">
          <Navbar />
        </header>
        <main className="max-w-5xl mx-auto px-0 lg:px-6 py-12">{children}</main>
        <footer className="border-t mt-12 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Soham Das — Built with Next.js + Tailwind
          CSS
        </footer>
      </body>
    </html>
  );
}
