import { cookies } from "next/headers";
import { Disclaimer } from "@/components/Disclaimer";
import { IntakeForm } from "@/components/IntakeForm";
import { SiteShell } from "@/components/SiteShell";
import { shortCompliance } from "@/lib/copy";
import { getPayment } from "@/lib/store";

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
    <SiteShell width="intake">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
        Inspection intake
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{shortCompliance}</p>
      <div className="mt-6">
        <Disclaimer />
      </div>
      <div className="mt-8">
        <IntakeForm paymentId={payment?.id} paid={paid} />
      </div>
    </SiteShell>
  );
}
