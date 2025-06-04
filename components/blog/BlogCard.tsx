import React from 'react'
import Link from 'next/link'
import { BlogPost } from '@/lib/dataFetcher'

interface BlogCardProps {
  post: BlogPost
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="card hover:shadow-md transition-shadow">
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
  )
}

export default BlogCard 