/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  // Increase API route body size limit for large images
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

export default nextConfig;
