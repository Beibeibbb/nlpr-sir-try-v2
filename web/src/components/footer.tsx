import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em]">SIR</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Smart Identity Recognition, New Laboratory of Pattern Recognition, State Key Laboratory of Multimodal Artificial Intelligence Systems, Institute of Automation, Chinese Academy of Sciences.
          </p>
          <p className="mt-3 text-sm text-zinc-500">智能身份识别课题组 · 中国科学院自动化研究所</p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Visit</p>
          <p className="mt-3 leading-6 text-zinc-600 dark:text-zinc-400">
            Intelligent Building
            <br />
            95 Zhongguancun East Road
            <br />
            Haidian District, Beijing 100190
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Index</p>
          <div className="mt-3 flex flex-col gap-2 text-zinc-600 dark:text-zinc-400">
            <Link href="/research/">Research</Link>
            <Link href="/publications/">Publications</Link>
            <Link href="/people/">People</Link>
            <Link href="/open-lab/">Datasets</Link>
            <a href="https://github.com/CRIPAC-SIR">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
