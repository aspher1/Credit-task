import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { Disclaimer } from "@/components/Disclaimer";
import { Frame } from "@/components/Frame";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
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
    <SiteShell>
      <Frame className="max-w-lg py-14 sm:py-20">
        <p className="kicker">Review access</p>
        <h1 className="display mt-4 text-4xl text-foreground">Admin sign in</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Credentials stub for the human approve path.
        </p>
        <div className="mt-8 space-y-6">
          <Disclaimer compact />
          {params.error ? (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950">
              Sign in failed. Check the admin email and password.
            </p>
          ) : null}
          <form
            className="space-y-5 border border-border bg-card p-6 sm:p-8"
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
        </div>
      </Frame>
    </SiteShell>
  );
}
