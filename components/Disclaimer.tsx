import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { legalDisclaimer } from "@/lib/copy";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <Alert variant="muted">
      <AlertTitle>{legalDisclaimer.title}</AlertTitle>
      <AlertDescription className={compact ? "text-xs" : undefined}>
        {legalDisclaimer.body}
      </AlertDescription>
    </Alert>
  );
}
