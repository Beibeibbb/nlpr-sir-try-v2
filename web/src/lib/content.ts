import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { datasetLinks, extraNews, extraPublications, personPatches, researchAreas } from "@/data/updates";
import type { Dataset, NewsItem, Person, Publication, ResearchArea, SiteData } from "@/lib/types";

function contentRoot() {
  const candidates = [path.join(process.cwd(), "..", "content"), path.join(process.cwd(), "content")];
  return candidates.find((dir) => fs.existsSync(path.join(dir, "authors"))) ?? candidates[0];
}

type Manifest = {
  people: Record<string, string>;
  publications: Record<string, string>;
  projects: Record<string, string>;
  posts: Record<string, string>;
  datasets: Record<string, string>;
  brand: Record<string, string>;
};

function readManifest(): Manifest {
  const file = path.join(process.cwd(), "src", "generated", "manifest.json");
  if (!fs.existsSync(file)) {
    return { people: {}, publications: {}, projects: {}, posts: {}, datasets: {}, brand: {} };
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as Manifest;
}

export function publicPath(url?: string) {
  if (!url) return url;
  if (/^(https?:)?\/\//.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function asArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return [value.trim()].filter(Boolean);
  return [];
}

function asString(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function cleanEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}

function cleanText(value: string) {
  return value
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function fixTypos(value: string) {
  return value
    .replace(/partten/gi, "pattern")
    .replace(/currnetly/gi, "currently")
    .replace(/resserch/gi, "research")
    .replace(/reserach/gi, "research")
    .replace(/Thchnology/g, "Technology")
    .replace(/Enginner/g, "Engineer")
    .replace(/biometic/gi, "biometric")
    .replace(/repectively/g, "respectively")
    .replace(/\u00a0/g, " ");
}

function readPage(dir: string) {
  for (const name of ["index.md", "_index.md"]) {
    const file = path.join(dir, name);
    if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  }
  if (!fs.existsSync(dir)) return "";
  const file = fs.readdirSync(dir).find((name) => name.endsWith(".md") && !name.startsWith("_"));
  return file ? fs.readFileSync(path.join(dir, file), "utf8") : "";
}

function folders(section: string) {
  const dir = path.join(contentRoot(), section);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function parseFile(section: string, folder: string) {
  const raw = readPage(path.join(contentRoot(), section, folder));
  if (!raw) return null;
  try {
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;
    // YAML turns unquoted timestamps into Date objects. Keep the authored calendar day.
    const authoredDate = raw.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1];
    if (authoredDate) data.date = authoredDate;
    return { data, body: parsed.content.trim() };
  } catch (error) {
    console.warn(`Skipped ${section}/${folder}:`, error);
    return null;
  }
}

function yearFrom(date: string, fallback = 0) {
  const match = date.match(/(19|20)\d{2}/);
  return match ? Number(match[0]) : fallback;
}

function kindFrom(types: string[]): Publication["kind"] {
  if (types.includes("1")) return "conference";
  if (types.includes("2")) return "journal";
  if (types.includes("3")) return "preprint";
  return "other";
}

function normalizeTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function rewriteMedia(markdown: string, base: string) {
  return markdown
    .replace(/!\[([^\]]*)\]\((?:\.\/)?(?!https?:)([^)\s]+)(?:\s+"[^"]*")?\)/g, (_match, alt: string, src: string) => {
      return `![${alt}](${base}/${src.replace(/^\.\//, "")})`;
    })
    .replace(/(<img\b[^>]*\ssrc=["'])(?!https?:|\/)([^"']+)(["'])/gi, `$1${base}/$2$3`);
}

function loadPeople(manifest: Manifest): Person[] {
  return folders("authors")
    .map((folder) => {
      const parsed = parseFile("authors", folder);
      if (!parsed) return null;
      const slug = slugify(folder);
      const groups = asArray(parsed.data.user_groups);
      const group = groups[0] || "Alumni";
      const social = Array.isArray(parsed.data.social) ? parsed.data.social : [];
      const website = social
        .map((item) => item as { icon?: string; link?: string })
        .find((item) => item.icon === "home" || item.icon === "google-scholar")?.link;
      const educationRaw = (parsed.data.education as { courses?: { course?: string; institution?: string; year?: string | number }[] } | undefined)?.courses ?? [];
      const person: Person = {
        slug,
        name: asString(parsed.data.title) || folder,
        role: asString(parsed.data.role) || "Member",
        group,
        order: 50,
        email: cleanEmail(asString(parsed.data.email)),
        website: asString(website),
        interests: asArray(parsed.data.interests).map(fixTypos),
        education: educationRaw.map((item) => ({
          course: fixTypos(asString(item.course)),
          institution: fixTypos(asString(item.institution)),
          year: asString(item.year),
        })),
        bio: fixTypos(parsed.body || asString(parsed.data.bio)),
        image: publicPath(manifest.people[slug]),
        honors: [],
      };
      const patch = personPatches[slug];
      if (patch) Object.assign(person, patch);
      return person;
    })
    .filter((person): person is Person => Boolean(person))
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

function loadPublications(manifest: Manifest): Publication[] {
  const archived = folders("publication")
    .map((folder) => {
      const parsed = parseFile("publication", folder);
      if (!parsed || parsed.data.publishDate === undefined && !parsed.data.title && !parsed.data.date) {
        if (!parsed?.data.title) return null;
      }
      if (!parsed) return null;
      const slug = slugify(folder);
      const date = asString(parsed.data.date).slice(0, 10);
      const title = cleanText(asString(parsed.data.title));
      if (!title) return null;
      const pub: Publication = {
        slug,
        title,
        authors: asArray(parsed.data.authors),
        date: date || "2000-01-01",
        year: yearFrom(date),
        venue: cleanText(asString(parsed.data.publication)),
        kind: kindFrom(asArray(parsed.data.publication_types)),
        abstract: fixTypos(asString(parsed.data.abstract)),
        summary: fixTypos(asString(parsed.data.summary)),
        tags: asArray(parsed.data.tags),
        doi: asString(parsed.data.doi),
        pdf: asString(parsed.data.url_pdf),
        code: asString(parsed.data.url_code),
        projects: asArray(parsed.data.projects).map(slugify),
        featured: Boolean(parsed.data.featured),
        image: publicPath(manifest.publications[slug]),
        body: rewriteMedia(parsed.body, publicPath(`/media/publications/${slug}`) || ""),
      };
      return pub;
    })
    .filter((item): item is Publication => Boolean(item));

  const seen = new Set(archived.map((item) => normalizeTitle(item.title)));
  const merged = [...extraPublications.filter((item) => !seen.has(normalizeTitle(item.title))), ...archived];
  return merged.sort((a, b) => b.date.localeCompare(a.date) || b.title.localeCompare(a.title));
}

function loadNews(manifest: Manifest): NewsItem[] {
  const archived = folders("post")
    .map((folder) => {
      const parsed = parseFile("post", folder);
      if (!parsed) return null;
      const slug = slugify(folder);
      const title = cleanText(asString(parsed.data.title));
      if (!title || slug === "welcome") return null;
      const item: NewsItem = {
        slug,
        title,
        date: asString(parsed.data.date).slice(0, 10) || "2000-01-01",
        summary: fixTypos(asString(parsed.data.summary)),
        kind: /award/i.test(title) ? "award" : "news",
        body: rewriteMedia(parsed.body, publicPath(`/media/posts/${slug}`) || ""),
        image: publicPath(manifest.posts[slug]),
        link: asString(parsed.data.external_link),
      };
      return item;
    })
    .filter((item): item is NewsItem => Boolean(item));

  const seen = new Set(archived.map((item) => normalizeTitle(item.title)));
  return [...extraNews.filter((item) => !seen.has(normalizeTitle(item.title))), ...archived].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

function loadDatasets(manifest: Manifest): Dataset[] {
  return folders("dataset")
    .map((folder) => {
      const parsed = parseFile("dataset", folder);
      if (!parsed) return null;
      const slug = slugify(folder);
      const linkMatch = parsed.body.match(/https?:\/\/(?:www\.)?idealtest\.org\/[^)\s"]+|https?:\/\/biometrics\.idealtest\.org\/[^)\s"]+/);
      const item: Dataset = {
        slug,
        title: cleanText(asString(parsed.data.title)) || folder,
        date: asString(parsed.data.date).slice(0, 10),
        summary: fixTypos(asString(parsed.data.summary)),
        tags: asArray(parsed.data.tags),
        body: rewriteMedia(parsed.body, publicPath(`/media/datasets/${slug}`) || ""),
        image: publicPath(manifest.datasets[slug]),
        link: datasetLinks[slug] || linkMatch?.[0],
      };
      return item;
    })
    .filter((item): item is Dataset => Boolean(item))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function withAreaImages(manifest: Manifest): ResearchArea[] {
  const imageFor: Record<string, string | undefined> = {
    "iris-recognition": manifest.projects["iris-recognition"] || manifest.brand.iris,
    "ocular-biometrics": manifest.projects["sclera-recognition"] || manifest.projects["periocular-recognition"],
    "light-field": manifest.projects["light-field-photography"],
    "imaging-systems": manifest.brand["iris-photo"] || manifest.brand.iris,
    "trustworthy-recognition": manifest.datasets["casia-iris-africa"] || manifest.datasets["casia-face-africa"],
    "human-perception": manifest.publications["hu-aaai-2024"] || manifest.projects["periocular-recognition"],
  };
  return researchAreas
    .map((area) => ({ ...area, image: publicPath(imageFor[area.slug]) }))
    .sort((a, b) => a.order - b.order);
}

let cache: SiteData | null = null;

export function getSite(): SiteData {
  if (cache) return cache;
  const manifest = readManifest();
  cache = {
    people: loadPeople(manifest),
    publications: loadPublications(manifest),
    news: loadNews(manifest),
    datasets: loadDatasets(manifest),
    areas: withAreaImages(manifest),
  };
  return cache;
}

export function getPerson(slug: string) {
  return getSite().people.find((person) => person.slug === slug);
}

export function getPublication(slug: string) {
  return getSite().publications.find((item) => item.slug === slug);
}

export function getNewsItem(slug: string) {
  return getSite().news.find((item) => item.slug === slug);
}

export function getDataset(slug: string) {
  return getSite().datasets.find((item) => item.slug === slug);
}

export function getArea(slug: string) {
  return getSite().areas.find((item) => item.slug === slug);
}

export function publicationsByAuthor(name: string) {
  const needle = name.toLowerCase();
  return getSite().publications.filter((item) => item.authors.some((author) => author.toLowerCase() === needle));
}

export function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year) return value;
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  if (!day || day === 1) {
    return new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
  }
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export function personByName(name: string) {
  return getSite().people.find((person) => person.name.toLowerCase() === name.toLowerCase());
}

export const groupMeta = [
  { id: "Director", label: "Leadership" },
  { id: "Faculty", label: "Faculty" },
  { id: "Staff", label: "Staff" },
  { id: "Graduate Students", label: "Graduate students" },
  { id: "Interns", label: "Interns" },
  { id: "Alumni", label: "Alumni" },
] as const;
