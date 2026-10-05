import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(webRoot, "..");
const contentRoot = path.join(repoRoot, "content");
const outRoot = path.join(webRoot, "public", "media");
const manifestPath = path.join(webRoot, "src", "generated", "manifest.json");

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...listImages(full));
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) found.push(full);
  }
  return found;
}

function pickFeatured(images) {
  const ranked = ["featured.jpg", "featured.jpeg", "featured.png", "featured.webp", "avatar.jpg", "avatar.png"];
  for (const name of ranked) {
    const hit = images.find((file) => path.basename(file).toLowerCase() === name);
    if (hit) return hit;
  }
  return images[0];
}

function copyTree(srcDir, destDir) {
  for (const file of listImages(srcDir)) {
    const rel = path.relative(srcDir, file).split(path.sep).join("/");
    copyFile(file, path.join(destDir, rel));
  }
}

function folders(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith("."))
    .map((entry) => entry.name);
}

ensureDir(outRoot);
ensureDir(path.dirname(manifestPath));

const manifest = { people: {}, publications: {}, projects: {}, posts: {}, datasets: {}, brand: {} };

const brandSources = [
  ["iris", path.join(repoRoot, "static", "media", "headers", "iris.png")],
  ["iris-photo", path.join(repoRoot, "static", "media", "iris.jpg")],
  ["iris-still", path.join(repoRoot, "static", "media", "iris.png")],
];

for (const [key, src] of brandSources) {
  if (!fs.existsSync(src)) continue;
  const ext = path.extname(src).toLowerCase();
  const destName = `${key}${ext}`;
  copyFile(src, path.join(outRoot, "brand", destName));
  manifest.brand[key] = `/media/brand/${destName}`;
}

for (const name of folders(path.join(contentRoot, "authors"))) {
  const slug = slugify(name);
  const images = listImages(path.join(contentRoot, "authors", name)).filter((file) =>
    /^avatar\./i.test(path.basename(file)),
  );
  const avatar = images[0];
  if (!avatar) continue;
  const ext = path.extname(avatar).toLowerCase();
  copyFile(avatar, path.join(outRoot, "people", `${slug}${ext}`));
  manifest.people[slug] = `/media/people/${slug}${ext}`;
}

for (const section of ["publication", "project", "post", "dataset"]) {
  const key = section === "publication" ? "publications" : section === "project" ? "projects" : section === "post" ? "posts" : "datasets";
  for (const name of folders(path.join(contentRoot, section))) {
    const slug = slugify(name);
    const srcDir = path.join(contentRoot, section, name);
    copyTree(srcDir, path.join(outRoot, key, slug));
    const featured = pickFeatured(listImages(srcDir));
    if (!featured) continue;
    const rel = path.relative(srcDir, featured).split(path.sep).join("/");
    manifest[key][slug] = `/media/${key}/${slug}/${rel}`;
  }
}

const logoSrc = path.join(repoRoot, "assets", "images", "icon.png");
if (fs.existsSync(logoSrc)) {
  copyFile(logoSrc, path.join(webRoot, "public", "logo.png"));
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Prepared media for ${Object.values(manifest).reduce((n, group) => n + Object.keys(group).length, 0)} items.`);
