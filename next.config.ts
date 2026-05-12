import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increase to 10MB or your desired limit
    },
    proxyClientMaxBodySize: "10mb",
  },
};

export default nextConfig;
