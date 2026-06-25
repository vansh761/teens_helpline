import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress the stale preload warning for hero-illustration.png which was
  // left behind from a previous deployment. Next.js will no longer inject a
  // <link rel="preload"> for an image asset that isn't rendered on any page.
  // If you add a hero illustration in future, import it with next/image so
  // Next.js can manage the preload hint automatically.
  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
