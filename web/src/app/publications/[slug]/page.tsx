import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CiteBox } from "@/components/cite";
import { Markdown } from "@/components/markdown";
import { getPublication, getSite, personByName } from "@/lib/content";

export function generateStaticParams() {
  return getSite().publications.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getPublication(slug)?.title ?? "Publication" };
}

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPublication(slug);
  if (!item) notFound();
  const field = item.kind === "conference" ? "booktitle" : "journal";
  const bibtex = `@${item.kind === "conference" ? "inproceedings" : "article"}{${item.slug},
  title={${item.title}},
  author={${item.authors.join(" and ")}},
  ${field}={${item.venue}},
  year={${item.year}}${item.doi ? `,
  doi={${item.doi}}` : ""}
}`;

  return (
    <article className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-32 lg:grid-cols-[1fr_18rem]">
      <div>
        <p className="kicker text-blue-700 dark:text-blue-300">
          {item.kind} · {item.year}
          {item.award ? ` · ${item.award}` : ""}
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">{item.title}</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-300">
          {item.authors.map((name, index) => {
            const person = personByName(name);
            return (
              <span key={name}>
                {index > 0 ? ", " : ""}
                {person ? <Link href={`/people/${person.slug}/`} className="underline decoration-zinc-300 underline-offset-4">{name}</Link> : name}
              </span>
            );
          })}
        </p>
        <p className="mt-2 text-zinc-500">{item.venue}</p>
        {item.abstract && <p className="mt-8 text-lg leading-8">{item.abstract}</p>}
        {item.body && (
          <div className="mt-8">
            <Markdown source={item.body} />
          </div>
        )}
        {item.image && <img src={item.image} alt="" className="mt-8 rounded-3xl border border-zinc-200 dark:border-zinc-800" />}
      </div>
      <aside className="space-y-4 lg:pt-16">
        {item.pdf && <a className="block rounded-full bg-zinc-900 px-4 py-2 text-center text-sm text-white dark:bg-zinc-100 dark:text-zinc-900" href={item.pdf}>PDF</a>}
        {item.code && <a className="block rounded-full border border-zinc-300 px-4 py-2 text-center text-sm dark:border-zinc-700" href={item.code}>Code</a>}
        {item.doi && <a className="block text-sm text-blue-700 dark:text-blue-300" href={item.doi.startsWith("http") ? item.doi : `https://doi.org/${item.doi}`}>DOI</a>}
        <CiteBox bibtex={bibtex} />
      </aside>
    </article>
  );
}
