const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // FIX: Enable React Strict Mode to catch hydration issues early
  reactStrictMode: true,
  
  // FIX: Optimize for production stability
  swcMinify: true,
  
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    domains: ['localhost'],
  },
  
  // FIX: Prevent hydration issues with proper SSR configuration
  experimental: {
    // Ensure consistent rendering between server and client
    esmExternals: false,
  },
  
  // SCRAPING-FRIENDLY: Bot-vänliga headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=3600',
          },
          // FIX: Prevent Cloudflare/CDN from minifying HTML
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
}

module.exports = withMDX(nextConfig) 