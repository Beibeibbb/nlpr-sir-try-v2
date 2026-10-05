import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { getDataset, getSite } from "@/lib/content";

export function generateStaticParams() {
  return getSite().datasets.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getDataset(slug)?.title ?? "Dataset" };
}

export default async function DatasetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getDataset(slug);
  if (!item) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-32">
      <p className="kicker text-blue-700 dark:text-blue-300">Dataset</p>
      <h1 className="mt-3 text-4xl font-medium tracking-tight">{item.title}</h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">{item.summary}</p>
      {item.link && (
        <a className="mt-6 inline-block rounded-full bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900" href={item.link}>
          Request or download
        </a>
      )}
      <div className="mt-8">
        <Markdown source={item.body} />
      </div>
    </article>
  );
}
