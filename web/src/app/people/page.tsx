import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { getSite, groupMeta } from "@/lib/content";

export const metadata: Metadata = { title: "People" };

export default function PeoplePage() {
  const { people } = getSite();
  const groups = groupMeta
    .map((group) => ({
      ...group,
      slug: group.id.toLowerCase().replace(/\s+/g, "-"),
      members: people.filter((person) => person.group === group.id),
    }))
    .filter((group) => group.members.length > 0);

  return (
    <>
      <PageHero
        kicker="People"
        title="The people who build the recognizers."
        lede="Faculty, engineers, students, and alumni of the Smart Identity Recognition group. Roles follow the group's own pages, with faculty biographies updated from public CASIA and personal academic profiles."
      />
      <div className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-14 flex flex-col gap-5 border-y border-zinc-200 py-5 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold tabular-nums text-blue-800 dark:text-blue-200">{people.length}</span> people in the group archive
          </p>
          <nav aria-label="Jump to a people group" className="flex flex-wrap gap-2">
            {groups.map((group) => (
              <a key={group.id} href={`#group-${group.slug}`} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-blue-600 dark:hover:text-blue-300">
                {group.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-16">
          {groups.map((group, index) => (
            <section key={group.id} id={`group-${group.slug}`} aria-labelledby={`heading-${group.slug}`} className="scroll-mt-32">
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-blue-200 pb-4 dark:border-blue-900/70">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm tabular-nums text-blue-700 dark:text-blue-400">0{index + 1}</span>
                  <h2 id={`heading-${group.slug}`} className="text-2xl font-medium tracking-tight md:text-3xl">{group.label}</h2>
                </div>
                <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">{group.members.length} {group.members.length === 1 ? "person" : "people"}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {group.members.map((person) => (
                  <Link key={person.slug} href={`/people/${person.slug}/`} className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm shadow-blue-950/[0.02] transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700">
                    <div className="aspect-square overflow-hidden bg-blue-50 dark:bg-slate-900">
                      {person.image ? (
                        <img src={person.image} alt="" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-4xl font-medium text-blue-700 dark:text-blue-300">{person.name.slice(0, 1)}</div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium leading-snug tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-300 sm:text-lg">{person.name}</h3>
                        <span aria-hidden="true" className="text-blue-700 transition-transform group-hover:translate-x-0.5 dark:text-blue-300">↗</span>
                      </div>
                      <p className="mt-1 text-sm leading-5 text-zinc-500 dark:text-zinc-400">{person.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
