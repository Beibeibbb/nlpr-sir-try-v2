import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  const { areas } = getSite();
  return (
    <>
      <PageHero
        kicker="Research"
        title="Six problems, one person in view."
        lede="From the iris camera to the privacy of the template, the group builds the pieces of recognition that still work when cooperation is thin."
      />
      <div className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-8 flex items-center justify-between border-y border-zinc-200 py-5 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <p><span className="font-semibold tabular-nums text-blue-800 dark:text-blue-200">{areas.length}</span> connected research areas</p>
          <p className="hidden font-mono text-xs uppercase tracking-[0.14em] sm:block">Explore the work ↓</p>
        </div>
        <div className="grid gap-5">
        {areas.map((area, index) => (
          <Link key={area.slug} href={`/research/${area.slug}/`} className="group grid overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm shadow-blue-950/[0.02] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 md:grid-cols-[18rem_minmax(0,1fr)] dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700">
            <div className="relative min-h-48 overflow-hidden bg-blue-900 md:min-h-64">
              {area.image && <img src={area.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/55 to-transparent" />
              <span className="absolute bottom-4 left-5 font-mono text-sm text-white/90">0{index + 1} / 0{areas.length}</span>
            </div>
            <div className="flex flex-col justify-center p-6 md:p-8">
              <p className="kicker text-blue-700 dark:text-blue-300">{area.shortTitle}</p>
              <h2 className="mt-2 text-2xl font-medium tracking-tight transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-300 md:text-3xl">{area.title}</h2>
              <p className="mt-3 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-300">{area.summary}</p>
              {area.highlights[0] && <p className="mt-4 border-l-2 border-blue-200 pl-3 text-sm leading-6 text-zinc-500 dark:border-blue-800 dark:text-zinc-400">{area.highlights[0]}</p>}
              <span className="mt-5 text-sm font-medium text-blue-700 dark:text-blue-300">Explore area <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">↗</span></span>
            </div>
          </Link>
        ))}
        </div>
      </div>
    </>
  );
}
