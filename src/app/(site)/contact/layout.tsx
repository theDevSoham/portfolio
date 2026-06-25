import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Soham Das - Portfolio",
  description: "Get in touch with Soham Das — Full Stack Developer.",
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Only contributes route-segment metadata; the document shell lives in the root layout.
  return <>{children}</>;
}
