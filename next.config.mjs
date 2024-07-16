/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'vibrant-dragon-346.convex.cloud',
            },
        ],
    }
};

export default nextConfig;
