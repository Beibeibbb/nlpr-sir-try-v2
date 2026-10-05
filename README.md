# SIR — Smart Identity Recognition

Lab website for the Smart Identity Recognition group at the New Laboratory of Pattern Recognition (NLPR) and the State Key Laboratory of Multimodal Artificial Intelligence Systems (MAIS), Institute of Automation, Chinese Academy of Sciences.

The public site is the Next.js app in `web/`. Its layout follows the VIDA lab site: a full-bleed introduction, research areas, a publication archive, people, news, and open datasets, with light and dark themes. Papers, members, news, and datasets in `content/` are read at build time. Newer group information gathered from public faculty pages is in `web/src/data/updates.ts`.

## Develop

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
cd web
npm run build
```

The static site is written to `web/out`. The public copy is built with `GITHUB_PAGES=true` and published from the `gh-pages` branch at https://oliverz-dot.github.io/nlpr-sir-try/.
