import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { fetchBlogPosts, BlogPost } from '@/lib/dataFetcher'

interface BlogPostPageProps {
  post: BlogPost
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
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
        <meta property="og:url" content={`https://paypro.se/blog/${post.slug}`} />
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

      <Header />

      <main className="py-8 bg-white">
        <article className="container-custom max-w-4xl mx-auto">
          {/* Back to blog */}
          <div className="mb-8">
            <Link href="/blog" className="text-paypro-600 hover:text-paypro-700 font-medium">
              ← Tillbaka till blogg
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
                {new Date(post.date).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span className="mx-2">•</span>
              <span>{post.readingTime}</span>
            </div>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {/* Mock content since we don't have MDX parsing yet */}
            <p>
              Sveriges betalningslandskap genomgår en dramatisk förändring. Swish, som lanserades 2012, 
              har på bara över ett decennium förvandlat hur svenskarna hanterar pengar i vardagen.
            </p>
            
            <h2>Swish revolutionerar vardagsbetalningar</h2>
            <p>
              Med över 8 miljoner användare och 2.1 miljarder transaktioner per månad har Swish blivit 
              synonymt med digitala betalningar i Sverige. Statistik från Riksbanken visar att kontantanvändningen 
              har minskat dramatiskt – från 40% av alla betalningar 2010 till endast 8% idag.
            </p>
            
            <h3>Vad driver tillväxten?</h3>
            <ul>
              <li><strong>Enkelhet:</strong> Betalningar med bara ett telefonnummer</li>
              <li><strong>Säkerhet:</strong> BankID-integration ger hög trygghet</li>
              <li><strong>Hastighet:</strong> Direkta överföringar dygnet runt</li>
              <li><strong>Kostnad:</strong> Gratis för privatpersoner</li>
            </ul>
            
            <h2>Framtiden för svenska betalningar</h2>
            <p>
              Utvecklingen mot ett kontantlöst samhälle accelererar. Riksbanken arbetar aktivt med 
              att utreda en digital krona (e-krona) som skulle kunna komplettera dagens system. 
              Samtidigt utvecklas nya betalningslösningar som A2A (Account to Account) och 
              realtidsbetalningar inom EU genom initiativ som EPI (European Payments Initiative).
            </p>
            
            <blockquote>
              "Sverige är en av världens mest digitaliserade ekonomier när det gäller betalningar. 
              Swish har spelat en nyckelroll i denna transformation." 
              - Cecilia Skingsley, tidigare vice riksbankschef
            </blockquote>
            
            <h2>Internationell jämförelse</h2>
            <p>
              Jämfört med andra länder ligger Sverige i framkant. Kina dominerar med Alipay och WeChat Pay, 
              medan Indien imponerar med UPI-systemet som hanterar över 13 miljarder transaktioner per månad. 
              Sverige däremot har lyckats skapa ett system som balanserar innovation med finansiell stabilitet.
            </p>
            
            <h2>Slutsats</h2>
            <p>
              Swish fortsätter att växa och utvecklas. Med nya funktioner som Swish för företag och 
              integration med e-handel befäster tjänsten sin position som ryggraden i det svenska 
              betalningssystemet. För PayPro.se kommer vi att fortsätta följa denna utveckling noga 
              och analysera dess effekter på både konsumenter och företag.
            </p>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Publicerad {new Date(post.date).toLocaleDateString('sv-SE')}
              </div>
              <div className="flex gap-4">
                <button className="text-paypro-600 hover:text-paypro-700">
                  Dela på Twitter
                </button>
                <button className="text-paypro-600 hover:text-paypro-700">
                  Dela på LinkedIn
                </button>
              </div>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchBlogPosts()
  const paths = posts.map((post) => ({
    params: { slug: post.slug }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const posts = await fetchBlogPosts()
  const post = posts.find((p) => p.slug === params?.slug)

  if (!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post
    }
  }
}

export default BlogPostPage 