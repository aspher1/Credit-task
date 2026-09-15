import { cookies } from "next/headers";
import { IntakeForm } from "@/components/IntakeForm";
import { SiteShell } from "@/components/SiteShell";
import { getPayment } from "@/lib/store";
import { intakeHelp } from "@/lib/copy";

export const dynamic = "force-dynamic";

export default async function IntakePage({
  searchParams,
}: {
  searchParams: Promise<{ paymentId?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const paymentId =
    params.paymentId || cookieStore.get("creditask_payment")?.value;
  const payment = paymentId ? await getPayment(paymentId) : null;
  const paid = payment?.status === "paid";

  return (
    <SiteShell>
      <h1 className="font-serif text-4xl text-[var(--navy)]">Inspection intake</h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        {intakeHelp.address} Files are stored privately on this server (not in{" "}
        <code>/public</code>).
      </p>
      <div className="mt-8 max-w-2xl">
        <IntakeForm paymentId={payment?.id} paid={paid} />
      </div>
    </SiteShell>
  );
}
