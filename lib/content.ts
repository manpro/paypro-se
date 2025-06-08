import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Locale } from '@/i18n.config'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  tags: string[]
  readingTime: string
  locale: Locale
}

export interface PageContent {
  title: string
  content: string
  locale: Locale
}

const contentDirectory = path.join(process.cwd(), 'content')
const blogDirectory = path.join(contentDirectory, 'blog')

export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
  if (!fs.existsSync(blogDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(blogDirectory)
  const posts: BlogPost[] = []

  for (const fileName of fileNames) {
    // Match files like "article-slug.sv.md" or "article-slug.en.md"
    const match = fileName.match(/^(.+)\.(sv|en)\.(md|html)$/)
    if (match && match[2] === locale) {
      const slug = match[1]
      const filePath = path.join(blogDirectory, fileName)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      
      let frontMatter: any
      let content: string

      if (fileName.endsWith('.html')) {
        // Extract metadata from HTML meta tags
        const titleMatch = fileContents.match(/<title>(.*?)<\/title>/i)
        const descriptionMatch = fileContents.match(/<meta name="description" content="(.*?)"/i)
        const authorMatch = fileContents.match(/<meta name="author" content="(.*?)"/i)
        const publishedMatch = fileContents.match(/<meta name="published" content="(.*?)"/i)
        const readingTimeMatch = fileContents.match(/<meta name="reading-time" content="(.*?)"/i)
        const keywordsMatch = fileContents.match(/<meta name="keywords" content="(.*?)"/i)
        
        frontMatter = {
          title: titleMatch ? titleMatch[1] : slug,
          date: publishedMatch ? publishedMatch[1] : new Date().toISOString(),
          author: authorMatch ? authorMatch[1] : 'PayPro Team',
          tags: keywordsMatch ? keywordsMatch[1].split(',').map(tag => tag.trim()) : [],
          excerpt: descriptionMatch ? descriptionMatch[1] : '',
          readingTime: readingTimeMatch ? readingTimeMatch[1] : '5 min'
        }
        content = fileContents
      } else {
        const matterResult = matter(fileContents)
        frontMatter = matterResult.data
        content = matterResult.content
      }

      posts.push({
        slug,
        title: frontMatter.title || slug,
        excerpt: frontMatter.excerpt || '',
        content,
        date: frontMatter.date || new Date().toISOString(),
        author: frontMatter.author || 'PayPro Team',
        tags: frontMatter.tags || [],
        readingTime: frontMatter.readingTime || '5 min',
        locale
      })
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getBlogPost(slug: string, locale: Locale): Promise<BlogPost | null> {
  const posts = await getBlogPosts(locale)
  return posts.find(post => post.slug === slug) || null
}

export async function getPageContent(page: string, locale: Locale): Promise<PageContent | null> {
  const filePath = path.join(contentDirectory, 'pages', `${page}.${locale}.md`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const matterResult = matter(fileContents)

  return {
    title: matterResult.data.title || page,
    content: matterResult.content,
    locale
  }
}

// Helper function to check if content exists in target language
export function contentExists(slug: string, locale: Locale, type: 'blog' | 'page' = 'blog'): boolean {
  const directory = type === 'blog' ? blogDirectory : path.join(contentDirectory, 'pages')
  const extensions = ['md', 'html']
  
  for (const ext of extensions) {
    const filePath = path.join(directory, `${slug}.${locale}.${ext}`)
    if (fs.existsSync(filePath)) {
      return true
    }
  }
  
  return false
} 