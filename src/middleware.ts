// middleware.ts
export { default } from "next-auth/middleware";

// Configure which routes to protect
export const config = {
  matcher: ["/admin/:path*"],
};
