import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminCredentials } from "@/lib/env";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const defaults = adminCredentials();

  return (
    <SiteShell width="intake">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Credentials stub for the human approve path. Default local login is{" "}
        <code>{defaults.email}</code> / <code>{defaults.password}</code> unless you
        override <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code>.
      </p>
      <div className="mt-6 space-y-4">
        <Disclaimer compact />
        {params.error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
            Sign in failed. Check the admin email and password.
          </p>
        ) : null}
        <Card>
          <CardContent className="pt-5">
            <form
              className="space-y-4"
              action={async (formData) => {
                "use server";
                const email = String(formData.get("email") ?? "");
                const password = String(formData.get("password") ?? "");
                const callbackUrl = params.callbackUrl || "/admin";
                try {
                  await signIn("credentials", {
                    email,
                    password,
                    redirectTo: callbackUrl,
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    redirect(`/admin/login?error=CredentialsSignin`);
                  }
                  throw error;
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={defaults.email} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue={defaults.password}
                  required
                />
              </div>
              <Button type="submit">Sign in</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  );
}
