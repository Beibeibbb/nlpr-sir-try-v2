export function PageHero({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <header className="mx-auto max-w-6xl px-4 pb-10 pt-32">
      <p className="kicker text-blue-700 dark:text-blue-300">{kicker}</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">{lede}</p>
    </header>
  );
}
