import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "solid-bassoon-jj5vqg7jrj6x2jj79-3000.app.github.dev",
], }, }, };

export default nextConfig;