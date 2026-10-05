import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArea, getSite } from "@/lib/content";

export function generateStaticParams() {
  return getSite().areas.map((area) => ({ slug: area.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => ({ title: getArea(slug)?.title ?? "Research" }));
}

export default async function ResearchAreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();
  const related = getSite().publications.filter((item) =>
    area.highlights.some((line) => item.title && line.toLowerCase().includes(item.title.slice(0, 24).toLowerCase())),
  );

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-32">
      <p className="kicker text-blue-700 dark:text-blue-300">{area.shortTitle}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">{area.title}</h1>
      <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">{area.summary}</p>
      {area.image && <img src={area.image} alt="" className="mt-8 aspect-[16/8] w-full rounded-3xl object-cover" />}
      <div className="mt-8 space-y-5 text-lg leading-8">
        {area.body.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
      <ul className="mt-8 space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        {area.highlights.map((item) => (
          <li key={item} className="text-zinc-700 dark:text-zinc-300">{item}</li>
        ))}
      </ul>
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm uppercase tracking-[0.16em] text-zinc-500">Related papers</h2>
          <ul className="mt-3 space-y-2">
            {related.slice(0, 4).map((item) => (
              <li key={item.slug}>
                <Link href={`/publications/${item.slug}/`} className="hover:text-blue-700 dark:hover:text-blue-300">{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
