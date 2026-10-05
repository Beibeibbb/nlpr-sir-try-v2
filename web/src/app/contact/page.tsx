import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Contact" };

const people = [
  ["Zhenan Sun", "znsun@nlpr.ia.ac.cn", "Professor"],
  ["Yunlong Wang", "yunlong.wang@ia.ac.cn", "Associate Professor"],
  ["Kunbo Zhang", "kunbo.zhang@casia.ia.ac.cn", "Associate Professor"],
  ["Tieniu Tan", "tieniu.tan@ia.ac.cn", "Professor"],
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Write to the group."
        lede="For academic correspondence, use a faculty address below. Dataset requests go through Ideal Test. The address matches the group's 2026 academic pages: 95 Zhongguancun East Road."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 md:grid-cols-2">
        <section className="rounded-3xl border border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-xl font-medium">Faculty</h2>
          <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
            {people.map(([name, email, role]) => (
              <li key={email} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-zinc-500">{role}</p>
                </div>
                <a className="text-sm text-blue-700 dark:text-blue-300" href={`mailto:${email}`}>{email}</a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-zinc-500">
            The previous site also listed 1047450724@qq.com for academic communication.
          </p>
        </section>
        <section className="rounded-3xl bg-blue-900 p-6 text-white">
          <h2 className="text-xl font-medium">Visit</h2>
          <p className="mt-4 leading-7 text-zinc-300">
            Intelligent Building, 16th floor
            <br />
            95 Zhongguancun East Road
            <br />
            Haidian District, Beijing 100190, China
          </p>
          <p className="mt-4 text-sm text-zinc-400">Weekdays, 9:00–17:00</p>
          <a className="mt-6 inline-block text-sm text-blue-200" href="https://www.idealtest.org/">Ideal Test datasets</a>
        </section>
      </div>
    </>
  );
}
