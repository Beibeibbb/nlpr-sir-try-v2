"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Publication } from "@/lib/types";

export function PublicationBrowser({ items }: { items: Publication[] }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<number | "all">("all");
  const [kind, setKind] = useState<"all" | Publication["kind"]>("all");
  const years = useMemo(() => Array.from(new Set(items.map((item) => item.year).filter(Boolean))).sort((a, b) => b - a), [items]);

  const visible = items.filter((item) => {
    const haystack = `${item.title} ${item.authors.join(" ")} ${item.venue}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase().trim())) return false;
    if (year !== "all" && item.year !== year) return false;
    if (kind !== "all" && item.kind !== kind) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search title, author, venue"
          className="h-11 flex-1 rounded-full border border-zinc-200 bg-white px-4 text-sm outline-none ring-blue-600 focus:ring-2 dark:border-zinc-800 dark:bg-zinc-950"
        />
        <div className="flex gap-2">
          {(["all", "journal", "conference"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setKind(value)}
              className={`rounded-full px-3 py-2 text-sm capitalize ${kind === value ? "bg-blue-700 text-white dark:bg-blue-600" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"}`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-[8rem_1fr]">
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          <YearButton current={year} value="all" onClick={setYear} label="All" />
          {years.map((value) => (
            <YearButton key={value} current={year} value={value} onClick={setYear} label={String(value)} />
          ))}
        </div>
        <div>
          <p className="mb-4 text-sm text-zinc-500">{visible.length} publications</p>
          <ol className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {visible.map((item) => (
              <li key={item.slug} className="grid grid-cols-[4.5rem_1fr] gap-4 py-5">
                <div className="pt-1 text-sm tabular-nums text-zinc-400">{item.year || ""}</div>
                <div>
                  <Link href={`/publications/${item.slug}/`} className="text-lg font-medium tracking-tight hover:text-blue-700 dark:hover:text-blue-300">
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.authors.slice(0, 6).join(", ")}
                    {item.authors.length > 6 ? " et al." : ""}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {item.venue}
                    {item.award ? ` · ${item.award}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function YearButton({
  current,
  value,
  label,
  onClick,
}: {
  current: number | "all";
  value: number | "all";
  label: string;
  onClick: (value: number | "all") => void;
}) {
  const selected = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`rounded-full px-3 py-1 text-left text-sm ${selected ? "bg-blue-700 text-white" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"}`}
    >
      {label}
    </button>
  );
}
