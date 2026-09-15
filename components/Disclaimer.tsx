import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { legalDisclaimer } from "@/lib/copy";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <Alert
      variant="muted"
      className="rounded-none border-y-0 border-r-0 border-l-primary/70 bg-transparent px-4 py-4 sm:px-5"
    >
      <AlertTitle className="mb-2 text-[0.7rem] font-medium tracking-[0.14em] text-primary uppercase sm:tracking-[0.28em]">
        {legalDisclaimer.title}
      </AlertTitle>
      <AlertDescription
        className={
          compact
            ? "text-[0.8125rem] leading-6 sm:text-xs sm:leading-relaxed"
            : "text-[0.9375rem] leading-7 sm:text-sm sm:leading-relaxed"
        }
      >
        {legalDisclaimer.body}
      </AlertDescription>
    </Alert>
  );
}
