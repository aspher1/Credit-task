import { cookies } from "next/headers";
import { Disclaimer } from "@/components/Disclaimer";
import { Frame } from "@/components/Frame";
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
    <SiteShell>
      <Frame className="max-w-3xl py-12 sm:py-16">
        <p className="kicker">Inspection pack</p>
        <h1 className="display mt-4 text-4xl text-foreground sm:text-5xl">
          Inspection intake
        </h1>
        <p className="mt-4 max-w-xl text-[0.975rem] leading-relaxed text-muted-foreground">
          {shortCompliance}
        </p>
        <div className="mt-8">
          <Disclaimer />
        </div>
        <div className="mt-10 border border-border bg-card p-6 sm:p-8">
          <IntakeForm paymentId={payment?.id} paid={paid} />
        </div>
      </Frame>
    </SiteShell>
  );
}
