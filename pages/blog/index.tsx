import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlogCard from '@/components/blog/BlogCard'
import { fetchBlogPosts, BlogPost } from '@/lib/dataFetcher'

const BlogIndex = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const posts = await fetchBlogPosts()
        setBlogPosts(posts)
      } catch (error) {
        console.error('Error loading blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBlogPosts()
  }, [])

  return (
    <>
      <Head>
        <title>Blogg - PayPro.se</title>
        <meta name="description" content="Senaste analyserna om betalningar, ekonomi och finansiella trender från PayPro.se experter." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Blogg - PayPro.se" />
        <meta property="og:description" content="Senaste analyserna om betalningar, ekonomi och finansiella trender." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://paypro.se/blog" />
      </Head>

      <Header />

      <main className="py-8 bg-gray-50 min-h-screen">
        <div className="container-custom">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Senaste Analyserna
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Djupgående artiklar om betalningar, ekonomi och finansiella innovationer från våra experter.
            </p>
          </div>

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-16 text-center card bg-paypro-600 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Håll dig uppdaterad
            </h2>
            <p className="text-paypro-100 mb-6 max-w-2xl mx-auto">
              Få våra senaste analyser och insikter om betalningar och ekonomi direkt i din inkorg.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Din e-postadress"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900"
              />
              <button className="px-6 py-2 bg-white text-paypro-600 rounded-lg font-medium hover:bg-paypro-50 transition-colors">
                Prenumerera
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default BlogIndex 