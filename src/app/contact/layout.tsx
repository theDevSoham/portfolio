"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-slate-300 antialiased">
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        >
          {children}
        </GoogleReCaptchaProvider>
      </body>
    </html>
  );
}
