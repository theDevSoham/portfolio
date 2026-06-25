import { withAuth } from "next-auth/middleware";

// Protect /admin and send unauthenticated users to the branded /login page
// (rather than NextAuth's default /api/auth/signin).
export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: ["/admin/:path*"],
};
