import React from 'react'
import Link from 'next/link'
import { BlogPost } from '@/lib/content'
import { Locale } from '@/i18n.config'

interface BlogCardProps {
  post: BlogPost
  locale: Locale
}

const BlogCard: React.FC<BlogCardProps> = ({ post, locale }) => {
  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.split(' ').length
  const readingTime = Math.ceil(wordCount / 200)
  const readingTimeText = locale === 'sv' 
    ? `${readingTime} min läsning` 
    : `${readingTime} min read`

  // Create locale-aware URL
  const getLocalizedHref = (slug: string) => {
    if (locale === 'en') {
      return `/en/blog/${slug}`
    }
    return `/blog/${slug}`
  }

  return (
    <article className="card hover:shadow-md transition-shadow">
      <div className="flex items-center text-sm text-gray-500 mb-3">
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
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-paypro-600">
        <Link href={getLocalizedHref(post.slug)}>
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
  )
}

export default BlogCard 