import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import { Locale, i18n } from '@/i18n.config'
import { getBlogPost, getBlogPosts } from '@/lib/content'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const params = []
  
  for (const locale of i18n.locales) {
    const posts = await getBlogPosts(locale)
    for (const post of posts) {
      params.push({
        locale,
        slug: post.slug
      })
    }
  }
  
  return params
}

interface BlogPostPageProps {
  params: {
    locale: Locale
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = params
  const post = await getBlogPost(slug, locale)

  if (!post) {
    notFound()
  }

  // Use reading time from post metadata
  const readingTimeText = post.readingTime || (locale === 'sv' ? '5 min läsning' : '5 min read')

  // Create locale-aware back link
  const getLocalizedHref = (path: string) => {
    if (locale === 'en') {
      return path === '/' ? '/en' : `/en${path}`
    }
    return path
  }

  return (
    <>
      <Head>
        <title>{post.title} - PayPro.se</title>
        <meta name="description" content={post.excerpt} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://paypro.se${getLocalizedHref(`/blog/${post.slug}`)}`} />
        <meta property="article:published_time" content={post.date} />
        
        {/* Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": post.excerpt,
              "datePublished": post.date,
              "author": {
                "@type": "Organization",
                "name": "PayPro.se"
              },
              "publisher": {
                "@type": "Organization",
                "name": "PayPro.se"
              }
            })
          }}
        />
      </Head>

      <Header locale={locale} />

      <main className="py-16 bg-white min-h-screen">
        <article className="container-custom max-w-4xl mx-auto">
          {/* Back to blog */}
          <div className="mb-8">
            <Link 
              href={getLocalizedHref('/blog')} 
              className="text-paypro-600 hover:text-paypro-700 font-medium"
            >
              ← {locale === 'sv' ? 'Tillbaka till blogg' : 'Back to blog'}
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-paypro-100 text-paypro-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-6">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="mx-2">•</span>
              <span>{readingTimeText}</span>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-paypro-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  )
} 