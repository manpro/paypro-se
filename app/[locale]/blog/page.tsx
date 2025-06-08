import React from 'react'
import Head from 'next/head'
import Header from '@/components/layout/Header'
import BlogCard from '@/components/blog/BlogCard'
import { Locale, i18n } from '@/i18n.config'
import { getBlogPosts } from '@/lib/content'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default async function BlogIndex({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  
  // Get blog posts for current locale
  const blogPosts = await getBlogPosts(locale)

  const title = locale === 'sv' ? 'Blogg' : 'Blog'
  const description = locale === 'sv' 
    ? 'Senaste analyser och insikter om ekonomi och betalningar'
    : 'Latest analysis and insights on economics and payments'

  return (
    <>
      <Head>
        <title>{title} - PayPro.se</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header locale={locale} />

      <main className="py-16 bg-gray-50 min-h-screen">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {locale === 'sv' ? 'Senaste analyserna' : 'Latest Insights'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {locale === 'sv' 
                ? 'Djupgående analyser om betalningar, ekonomi och finansiella trender från våra experter.'
                : 'In-depth analysis on payments, economics and financial trends from our experts.'
              }
            </p>
          </div>

          {blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {locale === 'sv' ? 'Inga blogginlägg tillgängliga än.' : 'No blog posts available yet.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
} 