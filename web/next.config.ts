import type { NextConfig } from "next";

const pagesRepo = process.env.GITHUB_PAGES_REPO?.trim();
const basePath = pagesRepo ? `/${pagesRepo}` : process.env.GITHUB_PAGES === "true" ? "/nlpr-sir-try" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
