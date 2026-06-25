import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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
    siteName: "Soham.dev",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Soham Das - Portfolio" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soham Das - Portfolio",
    description:
      "Explore projects, skills, and case studies by Soham Das — Full Stack Developer.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased min-h-screen bg-grid overflow-x-clip">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
