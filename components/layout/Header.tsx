'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Locale } from '@/i18n.config'
import { getTranslation } from '@/lib/translations'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

interface HeaderProps {
  locale: Locale
}

const Header = ({ locale }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const t = (key: keyof import('@/lib/translations').Translations) => getTranslation(key, locale)
  
  // Create locale-aware URLs
  const getLocalizedHref = (path: string) => {
    if (locale === 'en') {
      return path === '/' ? '/en' : `/en${path}`
    }
    return path
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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-paypro-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2 border-t border-gray-200 mt-4 pt-4">
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 