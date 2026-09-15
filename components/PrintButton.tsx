"use client";

export function PrintButton() {
  return (
    <button className="btn-primary" type="button" onClick={() => window.print()}>
      Print / Save as PDF
    </button>
  );
}
