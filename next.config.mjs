/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  serverActions: {
    bodySizeLimit: "4mb",
  },
  experimental: {
    proxyClientMaxBodySize: "4mb",
  },
};

export default nextConfig;
