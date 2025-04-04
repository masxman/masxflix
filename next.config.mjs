/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**', // Allow images from the /t/p/ path
      },
      // Add other allowed image domains here if needed
    ],
  },
};

export default nextConfig; 