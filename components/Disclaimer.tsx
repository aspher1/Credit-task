import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { legalDisclaimer } from "@/lib/copy";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <Alert
      variant="muted"
      className="border-stone-200 bg-stone-50 px-4 py-4 sm:px-5"
    >
      <AlertTitle className="mb-2 text-sm font-semibold text-stone-900">
        {legalDisclaimer.title}
      </AlertTitle>
      <AlertDescription
        className={
          compact
            ? "text-[0.8125rem] leading-6 text-stone-600 sm:text-xs sm:leading-relaxed"
            : "text-[0.9375rem] leading-7 text-stone-600 sm:text-sm sm:leading-relaxed"
        }
      >
        {legalDisclaimer.body}
      </AlertDescription>
    </Alert>
  );
}
