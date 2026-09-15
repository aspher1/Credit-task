import { letterHtml } from "@/lib/letter";

export function LetterPreview({ text }: { text: string }) {
  return (
    <article
      className="letter-paper font-serif text-[15px] leading-7 text-[var(--ink)]"
      dangerouslySetInnerHTML={{ __html: letterHtml(text) }}
    />
  );
}
