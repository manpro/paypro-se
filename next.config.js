const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    domains: ['localhost'],
  },
  // App Router i18n stöd
  async rewrites() {
    return [
      {
        source: '/en/:path*',
        destination: '/en/:path*',
      },
    ]
  },
}

module.exports = withMDX(nextConfig) 