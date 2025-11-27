import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.pinimg.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
  },
};

export default nextConfig;
