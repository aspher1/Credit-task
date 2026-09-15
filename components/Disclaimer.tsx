import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { legalDisclaimer } from "@/lib/copy";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <Alert variant="muted">
      <p className="kicker mb-3">Notice</p>
      <AlertTitle>{legalDisclaimer.title}</AlertTitle>
      <AlertDescription className={compact ? "text-xs" : undefined}>
        {legalDisclaimer.body}
      </AlertDescription>
    </Alert>
  );
}
