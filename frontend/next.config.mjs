import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
