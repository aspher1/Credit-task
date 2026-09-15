import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  secret: process.env.AUTH_SECRET || "creditask-dev-secret-not-for-production",
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLogin = pathname.startsWith("/admin/login");
      const needsAdmin =
        (pathname.startsWith("/admin") && !isLogin) ||
        pathname.endsWith("/approve");
      if (needsAdmin) return !!auth?.user;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = "admin";
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "admin";
        session.user.role = "admin";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
