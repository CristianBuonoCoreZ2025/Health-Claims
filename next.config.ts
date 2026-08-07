import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    const cfg = config as Record<string, unknown>;
    const isDev = typeof dev === "boolean" && dev;
    if (isDev) {
      Object.assign(cfg, { cache: { type: "memory" } });
    }
    return cfg;
  },
};

export default nextConfig;
