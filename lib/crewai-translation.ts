import axios from 'axios'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Locale } from '@/i18n.config'

const CREWAI_API_BASE = process.env.CREWAI_API_URL || 'http://172.16.16.148:8088'

interface TranslationRequest {
  source_language: string
  target_language: string
  content_type: 'blog_post' | 'ui_text' | 'marketing_copy'
  source_content: string
  preserve_formatting: boolean
  seo_optimize: boolean
}

interface TranslationResponse {
  translated_content: string
  metadata: {
    title?: string
    excerpt?: string
    tags?: string[]
  }
  quality_score: number
  notes: string[]
}

export async function translateArticle(
  sourceSlug: string,
  sourceLocale: Locale,
  targetLocale: Locale
): Promise<boolean> {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'blog')
    const sourceFile = path.join(contentDir, `${sourceSlug}.${sourceLocale}.md`)
    
    if (!fs.existsSync(sourceFile)) {
      console.error(`Source file not found: ${sourceFile}`)
      return false
    }

    const sourceContent = fs.readFileSync(sourceFile, 'utf8')
    const { data: frontMatter, content } = matter(sourceContent)
    
    // Prepare translation request
    const translationRequest: TranslationRequest = {
      source_language: sourceLocale === 'sv' ? 'Swedish' : 'English',
      target_language: targetLocale === 'sv' ? 'Swedish' : 'English',
      content_type: 'blog_post',
      source_content: JSON.stringify({
        title: frontMatter.title,
        excerpt: frontMatter.excerpt,
        content: content,
        tags: frontMatter.tags || []
      }),
      preserve_formatting: true,
      seo_optimize: true
    }

    // Call CrewAI translation API
    const response = await axios.post(
      `${CREWAI_API_BASE}/execute`,
      {
        command: 'translate_content',
        args: translationRequest
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minutes timeout for translation
      }
    )

    if (response.data?.status === 'success') {
      const translated: TranslationResponse = response.data.result
      
      // Create translated markdown file
      const translatedFrontMatter = {
        ...frontMatter,
        title: translated.metadata.title || frontMatter.title,
        excerpt: translated.metadata.excerpt || frontMatter.excerpt,
        tags: translated.metadata.tags || frontMatter.tags || [],
        translated_from: sourceLocale,
        translation_quality: translated.quality_score,
        translation_date: new Date().toISOString()
      }

      const translatedContent = matter.stringify(
        translated.translated_content,
        translatedFrontMatter
      )

      const targetFile = path.join(contentDir, `${sourceSlug}.${targetLocale}.md`)
      fs.writeFileSync(targetFile, translatedContent, 'utf8')
      
      console.log(`✅ Translated ${sourceSlug} from ${sourceLocale} to ${targetLocale}`)
      console.log(`Quality score: ${translated.quality_score}`)
      if (translated.notes.length > 0) {
        console.log('Translation notes:', translated.notes)
      }
      
      return true
    } else {
      console.error('Translation failed:', response.data)
      return false
    }
    
  } catch (error) {
    console.error('Error translating article:', error)
    return false
  }
}

export async function translateUIText(
  sourceTexts: Record<string, string>,
  sourceLocale: Locale,
  targetLocale: Locale
): Promise<Record<string, string> | null> {
  try {
    const translationRequest: TranslationRequest = {
      source_language: sourceLocale === 'sv' ? 'Swedish' : 'English',
      target_language: targetLocale === 'sv' ? 'Swedish' : 'English',
      content_type: 'ui_text',
      source_content: JSON.stringify(sourceTexts),
      preserve_formatting: false,
      seo_optimize: false
    }

    const response = await axios.post(
      `${CREWAI_API_BASE}/execute`,
      {
        command: 'translate_content',
        args: translationRequest
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    )

    if (response.data?.status === 'success') {
      const translated: TranslationResponse = response.data.result
      return JSON.parse(translated.translated_content)
    } else {
      console.error('UI translation failed:', response.data)
      return null
    }
    
  } catch (error) {
    console.error('Error translating UI text:', error)
    return null
  }
}

export async function bulkTranslateContent(
  sourceLocale: Locale,
  targetLocale: Locale
): Promise<void> {
  const contentDir = path.join(process.cwd(), 'content', 'blog')
  
  if (!fs.existsSync(contentDir)) {
    console.log('No content directory found')
    return
  }

  const files = fs.readdirSync(contentDir)
  const sourceFiles = files.filter(file => 
    file.endsWith(`.${sourceLocale}.md`) || file.endsWith(`.${sourceLocale}.html`)
  )

  console.log(`Found ${sourceFiles.length} files to translate from ${sourceLocale} to ${targetLocale}`)

  for (const file of sourceFiles) {
    const slug = file.replace(`.${sourceLocale}.md`, '').replace(`.${sourceLocale}.html`, '')
    const targetFile = `${slug}.${targetLocale}.md`
    
    if (!files.includes(targetFile)) {
      console.log(`Translating: ${slug}`)
      await translateArticle(slug, sourceLocale, targetLocale)
      
      // Add delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 5000))
    } else {
      console.log(`Translation already exists: ${targetFile}`)
    }
  }
}

// Mock translation function for development/testing
export function mockTranslateArticle(
  sourceSlug: string,
  sourceLocale: Locale,
  targetLocale: Locale
): boolean {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'blog')
    const sourceFile = path.join(contentDir, `${sourceSlug}.${sourceLocale}.html`)
    
    if (!fs.existsSync(sourceFile)) {
      console.error(`Source file not found: ${sourceFile}`)
      return false
    }

    const sourceContent = fs.readFileSync(sourceFile, 'utf8')
    
    // Simple mock translation - just add language prefix
    const mockTranslation = targetLocale === 'en' 
      ? sourceContent.replace(/<title>(.*?)<\/title>/i, '<title>[EN] $1</title>')
      : sourceContent.replace(/<title>(.*?)<\/title>/i, '<title>[SV] $1</title>')
    
    const targetFile = path.join(contentDir, `${sourceSlug}.${targetLocale}.html`)
    fs.writeFileSync(targetFile, mockTranslation, 'utf8')
    
    console.log(`✅ Mock translated ${sourceSlug} from ${sourceLocale} to ${targetLocale}`)
    return true
    
  } catch (error) {
    console.error('Error mock translating article:', error)
    return false
  }
} 