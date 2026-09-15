import { letterAttribution } from "@/lib/copy";

export function LetterArtifact() {
  return (
    <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
      <div
        className="absolute -inset-x-6 top-10 h-[70%] bg-[radial-gradient(ellipse_at_center,rgba(232,214,176,0.28),transparent_68%)]"
        aria-hidden
      />
      <article className="letter-artifact relative aspect-[8.5/11] w-full p-8 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-stone-500 uppercase">
            {letterAttribution}
          </p>
          <span className="h-px w-10 bg-stone-300" aria-hidden />
        </div>
        <p className="mt-10 text-[0.7rem] tracking-[0.08em] text-stone-400 uppercase">
          Re: Inspection follow-up
        </p>
        <div className="mt-6 space-y-3 font-serif text-[0.8rem] leading-6 text-stone-800">
          <p>Dear Seller,</p>
          <p>
            I am writing regarding the inspection. Based on the report and supporting
            materials, the following items need attention before we proceed.
          </p>
          <p>Please confirm how you would like to resolve these items in writing.</p>
          <p className="pt-4">Sincerely,</p>
        </div>
        <div className="absolute right-8 bottom-8 left-8 border-t border-stone-200 pt-3 text-[0.6rem] tracking-[0.12em] text-stone-400 uppercase">
          Draft for buyer review
        </div>
      </article>
    </div>
  );
}
