import Link from "next/link";
import { signOut } from "@/auth";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
import { listJobs } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const jobs = await listJobs();

  return (
    <SiteShell admin>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[var(--navy)]">Review queue</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Human approve is required before a letter is delivered.
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="btn-secondary" type="submit">
            Sign out
          </button>
        </form>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              <th className="py-2 pr-3">Job</th>
              <th className="py-2 pr-3">Address</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Paid</th>
              <th className="py-2">Open</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-[var(--line)]">
                <td className="py-3 pr-3 font-mono text-xs">
                  {job.id}
                  {job.example ? " · example" : ""}
                </td>
                <td className="py-3 pr-3">{job.address}</td>
                <td className="py-3 pr-3">
                  <StatusBadge status={job.status} />
                </td>
                <td className="py-3 pr-3">{job.paid ? "yes" : "no"}</td>
                <td className="py-3">
                  <Link className="underline" href={`/jobs/${job.id}/approve`}>
                    Approve
                  </Link>
                  {" · "}
                  <Link className="underline" href={`/jobs/${job.id}`}>
                    Job
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SiteShell>
  );
}
