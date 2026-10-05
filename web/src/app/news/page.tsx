import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { formatDate, getSite } from "@/lib/content";
import type { NewsItem } from "@/lib/types";

export const metadata: Metadata = { title: "News" };

const kindStyles: Record<NewsItem["kind"], string> = {
  news: "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300",
  award: "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
  release: "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300",
};

export default function NewsPage() {
  const { news } = getSite();
  const byYear = news.reduce<Record<string, NewsItem[]>>((groups, item) => {
    const year = item.date.slice(0, 4);
    (groups[year] ??= []).push(item);
    return groups;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <PageHero kicker="News" title="What the group has just finished." lede="Acceptances, awards, datasets, and the occasional note from the lab." />
      <section aria-label="News timeline" className="mx-auto max-w-5xl px-4 pb-24">
        <div className="mb-12 flex flex-col gap-5 border-y border-zinc-200 py-5 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-100">{news.length}</span> updates · newest first
          </p>
          <nav aria-label="Jump to a year" className="flex flex-wrap gap-2">
            {years.map((year) => (
              <a
                key={year}
                href={`#year-${year}`}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium tabular-nums text-zinc-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
              >
                {year}
              </a>
            ))}
          </nav>
        </div>

        <div className="news-timeline">
          {years.map((year) => (
            <section key={year} id={`year-${year}`} aria-labelledby={`heading-${year}`} className="news-timeline-year">
              <div className="news-timeline-year-heading">
                <h2 id={`heading-${year}`} className="text-3xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-100">
                  {year}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {byYear[year].length} {byYear[year].length === 1 ? "update" : "updates"}
                </p>
              </div>
              <span className="news-timeline-year-marker" aria-hidden="true" />
              <ol className="news-timeline-items">
                {byYear[year].map((item) => (
                  <li key={item.slug} className="news-timeline-entry">
                    <Link
                      href={`/news/${item.slug}/`}
                      className="group block rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm shadow-zinc-900/[0.02] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:border-blue-700"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <time dateTime={item.date} className="text-sm font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
                          {formatDate(item.date)}
                        </time>
                        <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] ${kindStyles[item.kind]}`}>
                          {item.kind}
                        </span>
                      </div>
                      <h3 className="mt-3 text-xl font-medium leading-snug tracking-tight text-zinc-900 transition-colors group-hover:text-blue-700 dark:text-zinc-100 dark:group-hover:text-blue-300 md:text-2xl">
                        {item.title}
                      </h3>
                      {item.summary && <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400 md:text-base">{item.summary}</p>}
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
