import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { adminCredentials } from "@/lib/env";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const expected = adminCredentials();
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");
        if (email === expected.email && password === expected.password) {
          return {
            id: "admin",
            name: "CreditAsk Admin",
            email: expected.email,
          };
        }
        return null;
      },
    }),
  ],
});
