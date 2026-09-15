import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";
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
      <h1 className="font-serif text-3xl text-[var(--navy)]">Admin sign in</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
        Credentials stub for the human approve path. Default local login is{" "}
        <code>{defaults.email}</code> / <code>{defaults.password}</code> unless you
        override <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code>.
      </p>
      <div className="mt-6 max-w-md space-y-4">
        <Disclaimer compact />
        {params.error ? (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">
            Sign in failed. Check the admin email and password.
          </p>
        ) : null}
        <form
          className="card space-y-4"
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
          <label className="block text-sm">
            Email
            <input className="input mt-1" name="email" type="email" defaultValue={defaults.email} required />
          </label>
          <label className="block text-sm">
            Password
            <input
              className="input mt-1"
              name="password"
              type="password"
              defaultValue={defaults.password}
              required
            />
          </label>
          <button className="btn-primary" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </SiteShell>
  );
}
