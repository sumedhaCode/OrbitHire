import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "0.0.0.0"],
  serverExternalPackages: ["mongoose", "mongodb", "mongodb-memory-server"],
};

export default nextConfig;
