import { Metadata } from "next";
import ReCaptchaProvider from "@/components/ReCaptchaProvider";

export const metadata: Metadata = {
  title: "Contact | Soham Das - Portfolio",
  description: "Get in touch with Soham Das — Full Stack Developer.",
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-slate-300 antialiased">
        <ReCaptchaProvider>{children}</ReCaptchaProvider>
      </body>
    </html>
  );
}
