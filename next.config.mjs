import nextTranslate from 'next-translate-plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.coupangcdn.com',
      },
    ],
  },
}

export default nextTranslate(nextConfig)
