import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { formatDate, getNewsItem, getSite } from "@/lib/content";

export function generateStaticParams() {
  return getSite().news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getNewsItem(slug)?.title ?? "News" };
}

export default async function NewsItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-32">
      <p className="kicker text-blue-700 dark:text-blue-300">{formatDate(item.date)}</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{item.title}</h1>
      {item.summary && <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">{item.summary}</p>}
      {item.image && <img src={item.image} alt="" className="mt-8 rounded-3xl" />}
      <div className="mt-8">
        <Markdown source={item.body} />
      </div>
      {item.link && <a className="mt-6 inline-block text-sm text-blue-700 dark:text-blue-300" href={item.link}>External link</a>}
    </article>
  );
}
