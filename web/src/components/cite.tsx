"use client";

import { useState } from "react";

export function CiteBox({ bibtex }: { bibtex: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 text-xs uppercase tracking-[0.14em] text-zinc-500 dark:border-zinc-800">
        BibTeX
        <button
          type="button"
          className="rounded-full bg-zinc-900 px-3 py-1 text-[11px] tracking-normal text-white normal-case dark:bg-zinc-100 dark:text-zinc-900"
          onClick={async () => {
            await navigator.clipboard.writeText(bibtex);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-5 text-zinc-700 dark:text-zinc-300">{bibtex}</pre>
    </div>
  );
}
