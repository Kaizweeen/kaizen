import type { NextConfig } from "next";

// GitHub Pages serves this site from /kaizen; the deploy workflow passes that in.
// Local dev and plain builds stay at the root.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // No image server on a static host; screenshots are already sized WebP.
  images: { unoptimized: true },
  // cacheComponents and partialPrefetching (scaffold defaults) are off: both need a
  // server, and static export refuses them.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
