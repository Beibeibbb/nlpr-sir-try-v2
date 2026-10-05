import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerson, getSite, publicationsByAuthor } from "@/lib/content";

export function generateStaticParams() {
  return getSite().people.map((person) => ({ slug: person.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getPerson(slug)?.name ?? "People" };
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) notFound();
  const papers = publicationsByAuthor(person.name).slice(0, 8);

  return (
    <article className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-32 md:grid-cols-[16rem_1fr]">
      <div>
        {person.image ? (
          <img src={person.image} alt="" className="aspect-square w-full rounded-3xl object-cover" />
        ) : (
          <div className="grid aspect-square w-full place-items-center rounded-3xl bg-zinc-100 text-4xl dark:bg-zinc-900">{person.name.slice(0, 1)}</div>
        )}
        <p className="mt-4 text-sm text-zinc-500">{person.role}</p>
        {person.email && <a className="mt-2 block text-sm text-blue-700 dark:text-blue-300" href={`mailto:${person.email}`}>{person.email}</a>}
        {person.website && <a className="mt-1 block text-sm text-blue-700 dark:text-blue-300" href={person.website}>Website</a>}
      </div>
      <div>
        <p className="kicker text-blue-700 dark:text-blue-300">{person.group}</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight">{person.name}</h1>
        {person.honors.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {person.honors.map((honor) => (
              <li key={honor} className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">{honor}</li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-lg leading-8 text-zinc-700 dark:text-zinc-200">{person.bio}</p>
        {person.interests.length > 0 && (
          <p className="mt-6 text-sm text-zinc-500">Interests · {person.interests.join(" · ")}</p>
        )}
        {person.education.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm uppercase tracking-[0.16em] text-zinc-500">Education</h2>
            <ul className="mt-3 space-y-3">
              {person.education.map((item) => (
                <li key={`${item.course}-${item.year}`}>
                  <p className="font-medium">{item.course}</p>
                  <p className="text-sm text-zinc-500">{item.institution}{item.year ? ` · ${item.year}` : ""}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {papers.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm uppercase tracking-[0.16em] text-zinc-500">Selected papers on this site</h2>
            <ul className="mt-3 divide-y divide-zinc-200 dark:divide-zinc-800">
              {papers.map((item) => (
                <li key={item.slug} className="py-3">
                  <Link href={`/publications/${item.slug}/`} className="font-medium hover:text-blue-700 dark:hover:text-blue-300">{item.title}</Link>
                  <p className="text-sm text-zinc-500">{item.year} · {item.venue}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
