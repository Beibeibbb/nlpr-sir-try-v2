import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PublicationBrowser } from "@/components/publication-browser";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Publications" };

export default function PublicationsPage() {
  const { publications } = getSite();
  return (
    <>
      <PageHero
        kicker="Publications"
        title="The record, newest first."
        lede="Journal and conference papers from the group archive, with 2025–2026 work added from faculty publication lists."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <PublicationBrowser items={publications} />
      </div>
    </>
  );
}
