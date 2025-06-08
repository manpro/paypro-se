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
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {i18n.locales.map((locale) => (
        <Link
          key={locale}
          href={getLocalizedPath(locale)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            currentLocale === locale
              ? 'bg-paypro-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-paypro-600 hover:bg-white hover:shadow-sm'
          }`}
          title={locale === 'sv' ? 'Byt till svenska' : 'Switch to English'}
        >
          {locale === 'sv' ? '🇸🇪 Svenska' : '🇬🇧 English'}
        </Link>
      ))}
    </div>
  )
} 