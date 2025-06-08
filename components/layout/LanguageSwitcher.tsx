'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Locale, i18n } from '@/i18n.config'

interface LanguageSwitcherProps {
  currentLocale: Locale
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname()
  
  const getLocalizedPath = (locale: Locale) => {
    // Handle null pathname case
    if (!pathname) return locale === 'sv' ? '/' : '/en'
    
    let basePath = pathname
    
    // Remove /en prefix if present
    if (basePath.startsWith('/en')) {
      basePath = basePath.substring(3) || '/'
    }
    
    // Return appropriate path for target locale
    if (locale === 'sv') {
      // Swedish is the default, no prefix needed
      return basePath
    } else {
      // English needs /en prefix
      return basePath === '/' ? '/en' : `/en${basePath}`
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {i18n.locales.map((locale) => (
        <Link
          key={locale}
          href={getLocalizedPath(locale)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            currentLocale === locale
              ? 'bg-paypro-600 text-white'
              : 'text-gray-600 hover:text-paypro-600 hover:bg-gray-100'
          }`}
        >
          {locale === 'sv' ? '🇸🇪 SV' : '🇬🇧 EN'}
        </Link>
      ))}
    </div>
  )
} 