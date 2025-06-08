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
    // Remove current locale from path
    const pathWithoutLocale = pathname.replace(/^\/(sv|en)/, '') || '/'
    
    // Add new locale (except for default Swedish)
    if (locale === 'sv') {
      return pathWithoutLocale === '/' ? '/' : pathWithoutLocale
    } else {
      return `/en${pathWithoutLocale}`
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