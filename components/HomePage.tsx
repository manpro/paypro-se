import React from 'react'
import Link from 'next/link'
import MetricBox from '@/components/dashboards/MetricBox'
import { fetchKeyMetrics, MetricData } from '@/lib/dataFetcher'
import { getBlogPosts, BlogPost } from '@/lib/content'
import { Locale } from '@/i18n.config'

interface HomePageProps {
  locale: Locale
}

export default async function HomePage({ locale }: HomePageProps) {
  let blogPosts: BlogPost[] = []
  let keyMetrics: MetricData[] = []
  let loading = false

  try {
    const [posts, metrics] = await Promise.all([
      getBlogPosts(locale),
      fetchKeyMetrics(locale)
    ])
    blogPosts = posts.slice(0, 3) // Show only latest 3 posts
    keyMetrics = metrics
  } catch (error) {
    console.error('Error loading homepage data:', error)
    loading = true
  }

  // Create locale-aware URLs
  const getLocalizedHref = (path: string) => {
    if (locale === 'en') {
      return path === '/' ? '/en' : `/en${path}`
    }
    // Both Swedish and English need locale prefixes
    return path === '/' ? '/sv' : `/sv${path}`
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-paypro-600 to-paypro-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {locale === 'sv' ? 'Framtidens betalningar börjar här' : 'The future of payments starts here'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-paypro-100">
              {locale === 'sv' 
                ? 'Djupgående analys av svensk och global ekonomi, betalningsteknologi och finansiella trender.'
                : 'In-depth analysis of Swedish and global economics, payment technology and financial trends.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={getLocalizedHref('/blog')} className="btn-primary text-center">
                {locale === 'sv' ? 'Läs senaste analyserna' : 'Read latest insights'}
              </Link>
              <Link href={getLocalizedHref('/dashboards/makro')} className="btn-secondary bg-white text-paypro-800 hover:bg-paypro-50 text-center">
                {locale === 'sv' ? 'Utforska data' : 'Explore data'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {locale === 'sv' ? 'Nyckeltal idag' : 'Key metrics today'}
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="metric-box animate-pulse">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMetrics.map((metric, index) => (
                <MetricBox key={index} {...metric} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {locale === 'sv' ? 'Senaste analyserna' : 'Latest insights'}
            </h2>
            <Link href={getLocalizedHref('/blog')} className="text-paypro-600 hover:text-paypro-700 font-medium">
              {locale === 'sv' ? 'Visa alla →' : 'View all →'}
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-20 bg-gray-300 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-300 rounded"></div>
                    <div className="h-6 w-20 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.slug} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                    <span className="mx-2">•</span>
                    <span>{post.readingTime}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-paypro-600">
                    <Link href={getLocalizedHref(`/blog/${post.slug}`)}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-paypro-100 text-paypro-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-paypro-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            {locale === 'sv' ? 'Håll dig uppdaterad med svensk ekonomi' : 'Stay updated with Swedish economy'}
          </h2>
          <p className="text-xl mb-8 text-paypro-100 max-w-2xl mx-auto">
            {locale === 'sv' 
              ? 'Få tillgång till djupgående analyser, realtidsdata och expertinsikter om betalningar och ekonomiska trender.'
              : 'Get access to in-depth analysis, real-time data and expert insights on payments and economic trends.'
            }
          </p>
          <Link href={getLocalizedHref('/dashboards/makro')} className="btn-secondary bg-white text-paypro-800 hover:bg-paypro-50">
            {locale === 'sv' ? 'Utforska våra dashboards' : 'Explore our dashboards'}
          </Link>
        </div>
      </section>
    </main>
  )
} 