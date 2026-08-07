import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      config.cache = { type: "memory" };
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config;
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
};

export default nextConfig;
