import React from 'react'
import Link from 'next/link'
import { Locale } from '@/i18n.config'
import { getTranslation } from '@/lib/translations'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import MobileMenu from '@/components/layout/MobileMenu'

interface HeaderProps {
  locale: Locale
}

const Header = ({ locale }: HeaderProps) => {
  const t = (key: keyof import('@/lib/translations').Translations) => getTranslation(key, locale)
  
  // Create locale-aware URLs
  const getLocalizedHref = (path: string) => {
    if (locale === 'en') {
      return path === '/' ? '/en' : `/en${path}`
    }
    // Both Swedish and English need locale prefixes
    return path === '/' ? '/sv' : `/sv${path}`
  }

  const navigation = [
    { name: t('nav.home'), href: getLocalizedHref('/') },
    { name: t('nav.blog'), href: getLocalizedHref('/blog') },
    { name: t('nav.macro'), href: getLocalizedHref('/dashboards/makro') },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={getLocalizedHref('/')} className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-paypro-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PayPro.se</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-paypro-600 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {/* Mobile Menu */}
          <MobileMenu navigation={navigation} locale={locale} />
        </div>
      </div>
    </header>
  )
}

export default Header 