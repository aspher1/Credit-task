import { letterHtml } from "@/lib/letter";
import { cn } from "@/lib/utils";

export function LetterPreview({
  text,
  draft = false,
}: {
  text: string;
  draft?: boolean;
}) {
  return (
    <article className={cn("letter-page", draft && "letter-draft")}>
      {draft ? <div className="letter-watermark" aria-hidden>DRAFT</div> : null}
      <div dangerouslySetInnerHTML={{ __html: letterHtml(text) }} />
      <p className="letter-footer">Not legal advice</p>
    </article>
  );
}
