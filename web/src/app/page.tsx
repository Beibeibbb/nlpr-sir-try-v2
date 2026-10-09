import Link from "next/link";
import { formatDate, getSite, publicPath } from "@/lib/content";

export default function HomePage() {
  const { people, publications, news, datasets, areas } = getSite();
  const faculty = people.filter((person) => person.group === "Director" || person.group === "Faculty");
  const latestNews = news.slice(0, 4);
  const latestPapers = publications.slice(0, 4);
  const featured = publications.find((item) => item.featured) ?? latestPapers[0];
  const side = latestPapers.filter((item) => item.slug !== featured?.slug).slice(0, 3);

  return (
    <>
      <section className="relative min-h-[92vh] overflow-hidden">
        <img src={publicPath("/media/brand/iris.png")} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-900/70 to-blue-800/15" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-32">
          <p className="kicker text-blue-200">NLPR · MAIS · CASIA</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-medium tracking-tight text-white md:text-7xl">
            Recognizing identity in the open world.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
            The Smart Identity Recognition group studies human-centric biometrics: iris and ocular imaging, light-field cameras, privacy-preserving templates, and perception when a person will not stand still.
          </p>
          <p className="mt-6 text-sm text-zinc-300">
            Led by Prof. Tieniu Tan and Prof. Zhenan Sun, with faculty Yunlong Wang and Kunbo Zhang.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/research/" className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-950">
              Research areas
            </Link>
            <Link href="/publications/" className="rounded-full border border-white/30 px-5 py-2.5 text-sm text-white">
              Recent papers
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="kicker text-blue-700 dark:text-blue-300">The group</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">Identity, from the sensor to the decision.</h2>
          <div className="mt-6 space-y-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            <p>
              SIR is part of the New Laboratory of Pattern Recognition and the State Key Laboratory of Multimodal Artificial Intelligence Systems at the Institute of Automation, Chinese Academy of Sciences. MAIS was approved in 2022, when the pattern-recognition and complex-systems national key laboratories were reorganized into one of the first benchmark national key laboratories.
            </p>
            <p>
              The work covers imaging hardware, acquisition, preprocessing, feature encoding, matching, and the privacy of the template that comes out. Iris, sclera, periocular, face, three-dimensional human perception, and millimeter-wave sensing are all in scope, with a standing focus on non-cooperative recognition at a distance.
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 self-end">
          <Stat value={String(publications.length)} label="Papers on this site" />
          <Stat value={String(datasets.length)} label="Public datasets" />
          <Stat value={String(people.filter((person) => person.group !== "Alumni").length)} label="Current members" />
          <Stat value="10 m" label="Long-range ocular capture" />
        </dl>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-4 pb-8">
          <div className="flex items-center justify-between gap-4">
            <p className="kicker text-blue-700 dark:text-blue-300">Latest work</p>
            <Link href="/publications/" className="text-sm text-blue-700 dark:text-blue-300">All publications</Link>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
            <Link href={`/publications/${featured.slug}/`} className="group rounded-3xl border border-zinc-200 bg-white p-8 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                {featured.kind} · {featured.year}
                {featured.award ? ` · ${featured.award}` : ""}
              </p>
              <p className="mt-3 text-sm text-blue-700 dark:text-blue-300">{featured.venue}</p>
              <h3 className="mt-4 text-3xl font-medium tracking-tight transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-300">{featured.title}</h3>
              <p className="mt-4 text-sm text-zinc-500">{featured.authors.join(", ")}</p>
              <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">{featured.abstract || featured.venue}</p>
            </Link>
            <div className="grid gap-4">
              {side.map((item) => (
                <Link key={item.slug} href={`/publications/${item.slug}/`} className="rounded-3xl border border-zinc-200 bg-white/70 p-5 transition hover:border-blue-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-800 dark:bg-zinc-950/70 dark:hover:border-blue-700">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{item.kind} · {item.year}</p>
                  <p className="mt-2 font-medium tracking-tight">{item.title}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">{item.venue}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker text-blue-700 dark:text-blue-300">Recognition</p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight">Awards and marks</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            ["2025", "CVPR Highlight", "Prototypical skeleton action recognition, Hongda Liu et al."],
            ["2025", "IEEE Senior Member", "Yunlong Wang, October 2025."],
            ["2024", "U.S. patents issued", "Two federated-learning patents, 22 October 2024."],
            ["2023", "IJCB Best Student Paper", "Sclera-TransFuse, presented to Haiqing Li."],
            ["2022", "CSIG invention award", "Second prize, Technology Invention Award of the China Society of Image and Graphics."],
            ["2020", "IJCB Best Paper runner-up", "All-in-Focus Iris Camera with a Great Capture Volume."],
          ].map(([year, title, text]) => (
            <article key={title} className="grid grid-cols-[4rem_1fr] gap-4 rounded-2xl border border-zinc-200 px-4 py-4 dark:border-zinc-800">
              <p className="text-sm tabular-nums text-zinc-400">{year}</p>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="kicker text-blue-700 dark:text-blue-300">Gazette</p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight">News</h2>
          </div>
          <Link href="/news/" className="text-sm text-blue-700 dark:text-blue-300">All news</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {latestNews[0] && (
            <Link href={`/news/${latestNews[0].slug}/`} className="rounded-3xl bg-blue-900 p-7 text-white md:col-span-2">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">{formatDate(latestNews[0].date)}</p>
              <h3 className="mt-4 text-3xl font-medium tracking-tight">{latestNews[0].title}</h3>
              <p className="mt-4 max-w-xl leading-7 text-zinc-300">{latestNews[0].summary}</p>
            </Link>
          )}
          <div className="grid gap-4">
            {latestNews.slice(1, 3).map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}/`} className="rounded-3xl border border-zinc-200 p-5 transition hover:border-blue-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-800 dark:hover:border-blue-700 dark:hover:bg-zinc-950">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{formatDate(item.date)}</p>
                <h3 className="mt-2 font-medium tracking-tight">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="kicker text-blue-700 dark:text-blue-300">Research</p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight">Active areas</h2>
          </div>
          <Link href="/research/" className="text-sm text-blue-700 dark:text-blue-300">All areas</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {areas.map((area) => (
            <Link key={area.slug} href={`/research/${area.slug}/`} className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700">
              <div className="aspect-[16/9] bg-zinc-100 dark:bg-zinc-900">
                {area.image && <img src={area.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">{area.shortTitle}</p>
                <h3 className="mt-2 text-xl font-medium tracking-tight">{area.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{area.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-2 flex items-end justify-between border-b border-zinc-900 pb-3 dark:border-zinc-100">
          <h2 className="font-mono text-sm uppercase tracking-[0.18em]">Recent publications</h2>
          <Link href="/publications/" className="text-sm">Browse the archive</Link>
        </div>
        <ol>
          {latestPapers.map((item) => (
            <li key={item.slug} className="grid gap-3 border-b border-zinc-200 py-5 md:grid-cols-[5rem_1fr_auto] dark:border-zinc-800">
              <p className="font-mono text-sm text-zinc-400">{item.year}</p>
              <div>
                <Link href={`/publications/${item.slug}/`} className="text-lg font-medium tracking-tight hover:text-blue-700 dark:hover:text-blue-300">
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-zinc-500">{item.authors.slice(0, 4).join(", ")}{item.authors.length > 4 ? " et al." : ""}</p>
              </div>
              <p className="text-sm text-zinc-500 md:max-w-xs md:text-right">{item.venue}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-medium tracking-tight">People</h2>
          <Link href="/people/" className="text-sm text-blue-700 dark:text-blue-300">Full group</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {faculty.map((person) => (
            <Link key={person.slug} href={`/people/${person.slug}/`} className="rounded-3xl border border-zinc-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700">
              <Avatar name={person.name} image={person.image} />
              <p className="mt-4 font-medium">{person.name}</p>
              <p className="text-sm text-zinc-500">{person.role}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <dt className="text-3xl font-medium tracking-tight">{value}</dt>
      <dd className="mt-1 text-sm text-zinc-500">{label}</dd>
    </div>
  );
}

function Avatar({ name, image }: { name: string; image?: string }) {
  if (image) return <img src={image} alt="" className="aspect-square w-full rounded-2xl object-cover" />;
  return <div className="grid aspect-square w-full place-items-center rounded-2xl bg-blue-100 text-2xl text-blue-800">{name.slice(0, 1)}</div>;
}
