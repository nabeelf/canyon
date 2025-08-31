import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // The `serverExternalPackages` option allows you to opt-out of bundling dependencies in your Server Components.
  serverExternalPackages: ["puppeteer"],
};

export default nextConfig;
