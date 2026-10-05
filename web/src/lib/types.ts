export type Person = {
  slug: string;
  name: string;
  role: string;
  group: string;
  order: number;
  email: string;
  website: string;
  interests: string[];
  education: { course: string; institution: string; year: string }[];
  bio: string;
  image?: string;
  honors: string[];
};

export type Publication = {
  slug: string;
  title: string;
  authors: string[];
  date: string;
  year: number;
  venue: string;
  kind: "journal" | "conference" | "preprint" | "other";
  abstract: string;
  summary: string;
  tags: string[];
  doi: string;
  pdf: string;
  code: string;
  projects: string[];
  featured: boolean;
  image?: string;
  body: string;
  award?: string;
};

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  kind: "news" | "award" | "release";
  body: string;
  image?: string;
  link?: string;
};

export type Dataset = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  body: string;
  image?: string;
  link?: string;
};

export type ResearchArea = {
  slug: string;
  title: string;
  shortTitle: string;
  order: number;
  summary: string;
  image?: string;
  body: string[];
  highlights: string[];
};

export type SiteData = {
  people: Person[];
  publications: Publication[];
  news: NewsItem[];
  datasets: Dataset[];
  areas: ResearchArea[];
};
