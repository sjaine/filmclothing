import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'm.media-amazon.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com', // Notion default
      'images.unsplash.com',      
      'i.namu.wiki',
    ],
  },
};

export default nextConfig;
