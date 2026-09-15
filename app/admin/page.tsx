import Link from "next/link";
import { signOut } from "@/auth";
import { Frame } from "@/components/Frame";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { listJobs } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const jobs = await listJobs();

  return (
    <SiteShell>
      <Frame className="max-w-5xl py-12 sm:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker">Review</p>
            <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">
              Review queue
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Human approve is required before a letter is delivered.
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button variant="outline" type="submit">
              Sign out
            </Button>
          </form>
        </div>
        <div className="mt-10 overflow-x-auto border border-border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-[var(--paper-2)] text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
                <th className="px-4 py-3 pr-3">Job</th>
                <th className="px-4 py-3 pr-3">Address</th>
                <th className="px-4 py-3 pr-3">Status</th>
                <th className="px-4 py-3 pr-3">Paid</th>
                <th className="px-4 py-3">Open</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 pr-3 font-mono text-xs">
                    {job.id}
                    {job.example ? " · example" : ""}
                  </td>
                  <td className="px-4 py-3 pr-3">{job.address}</td>
                  <td className="px-4 py-3 pr-3">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3 pr-3">{job.paid ? "yes" : "no"}</td>
                  <td className="px-4 py-3">
                    <Link className="underline underline-offset-4" href={`/jobs/${job.id}/approve`}>
                      Approve
                    </Link>
                    {" · "}
                    <Link className="underline underline-offset-4" href={`/jobs/${job.id}`}>
                      Job
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Frame>
    </SiteShell>
  );
}
