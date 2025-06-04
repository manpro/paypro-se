import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MetricBox from '@/components/dashboards/MetricBox'
import { fetchBlogPosts, fetchKeyMetrics, BlogPost, MetricData } from '@/lib/dataFetcher'

const HomePage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [keyMetrics, setKeyMetrics] = useState<MetricData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [posts, metrics] = await Promise.all([
          fetchBlogPosts(),
          fetchKeyMetrics()
        ])
        setBlogPosts(posts.slice(0, 3)) // Show only latest 3 posts
        setKeyMetrics(metrics)
      } catch (error) {
        console.error('Error loading homepage data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <>
      <Head>
        <title>PayPro.se - Analys av betalningar och ekonomi</title>
        <meta name="description" content="Ledande analys och insikter om betalningar, ekonomi och finansiella trender i Sverige och världen." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content="PayPro.se - Analys av betalningar och ekonomi" />
        <meta property="og:description" content="Ledande analys och insikter om betalningar, ekonomi och finansiella trender i Sverige och världen." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://paypro.se" />
        
        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PayPro.se",
              "url": "https://paypro.se",
              "description": "Analys av betalningar och ekonomi"
            })
          }}
        />
      </Head>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-paypro-600 to-paypro-800 text-white py-20">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Framtidens betalningar börjar här
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-paypro-100">
                Djupgående analys av svensk och global ekonomi, betalningsteknologi och finansiella trender.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/blog" className="btn-primary text-center">
                  Läs senaste analyserna
                </Link>
                <Link href="/dashboards/makro" className="btn-secondary bg-white text-paypro-800 hover:bg-paypro-50 text-center">
                  Utforska data
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Nyckeltal idag
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
                Senaste analyserna
              </h2>
              <Link href="/blog" className="text-paypro-600 hover:text-paypro-700 font-medium">
                Visa alla →
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
                        {new Date(post.date).toLocaleDateString('sv-SE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span className="mx-2">•</span>
                      <span>{post.readingTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-paypro-600">
                      <Link href={`/blog/${post.slug}`}>
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
              Håll dig uppdaterad med svensk ekonomi
            </h2>
            <p className="text-xl mb-8 text-paypro-100 max-w-2xl mx-auto">
              Få tillgång till djupgående analyser, realtidsdata och expertinsikter om betalningar och ekonomiska trender.
            </p>
            <Link href="/dashboards/makro" className="btn-secondary bg-white text-paypro-800 hover:bg-paypro-50">
              Utforska våra dashboards
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default HomePage 