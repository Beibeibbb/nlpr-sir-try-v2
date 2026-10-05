import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Open Lab" };

export default function OpenLabPage() {
  const { datasets } = getSite();
  return (
    <>
      <PageHero
        kicker="Open lab"
        title="Datasets the community can request."
        lede="Iris, face, light-field, and polarization collections released for research. Most downloads are approved through the CASIA Ideal Test portal."
      />
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between border-y border-zinc-200 py-5 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <p><span className="font-semibold tabular-nums text-blue-800 dark:text-blue-200">{datasets.length}</span> datasets in the archive</p>
          <p className="hidden font-mono text-xs uppercase tracking-[0.14em] sm:block">Browse the collections ↓</p>
        </div>
        <div className="grid gap-5 pb-14 md:grid-cols-2">
          {datasets.map((item, index) => (
            <Link key={item.slug} href={`/open-lab/${item.slug}/`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm shadow-blue-950/[0.02] transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700">
              <div className="relative aspect-[16/8] overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700">
                {item.image && <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/55 to-transparent" />
                <span className="absolute bottom-4 left-5 font-mono text-xs uppercase tracking-[0.16em] text-white">Dataset {String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-medium tracking-tight transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-300">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.summary}</p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  {item.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">{tag}</span>)}
                  <span className="ml-auto text-sm font-medium text-blue-700 dark:text-blue-300">View dataset <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">↗</span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-col gap-5 rounded-3xl border border-blue-200 bg-blue-50/70 p-6 md:flex-row md:items-center md:justify-between md:p-8 dark:border-blue-900 dark:bg-blue-900/40">
          <div>
            <p className="kicker text-blue-700 dark:text-blue-300">Open source</p>
            <h2 className="mt-2 text-xl font-medium">Code from the group</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Shared implementations live under the CRIPAC-SIR organization. Individual papers also link to author repositories when a release exists.
            </p>
          </div>
          <a className="shrink-0 rounded-full bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600" href="https://github.com/CRIPAC-SIR">View on GitHub ↗</a>
        </div>
      </section>
    </>
  );
}
