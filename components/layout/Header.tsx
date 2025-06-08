'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Locale } from '@/i18n.config'
import { getTranslation } from '@/lib/translations'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

interface HeaderProps {
  locale?: Locale
}

const Header = ({ locale }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Detect current locale from pathname if not provided
  const currentLocale = locale || (pathname?.startsWith('/en') ? 'en' : 'sv')
  
  const t = (key: keyof import('@/lib/translations').Translations) => getTranslation(key, currentLocale)
  
  // Create locale-aware URLs
  const getLocalizedHref = (path: string) => {
    if (currentLocale === 'en') {
      return path === '/' ? '/en' : `/en${path}`
    }
    return path
  }

  const navigation = [
    { name: t('nav.home'), href: getLocalizedHref('/') },
    { name: t('nav.blog'), href: getLocalizedHref('/blog') },
    { 
      name: t('nav.dashboards'), 
      href: '#',
      children: [
        { name: t('nav.macro'), href: getLocalizedHref('/dashboards/makro') },
        { 
          name: currentLocale === 'sv' ? 'Svenska Betalningar' : 'Swedish Payments', 
          href: getLocalizedHref('/dashboards/swish') 
        },
        { 
          name: currentLocale === 'sv' ? 'Globala Trender' : 'Global Trends', 
          href: getLocalizedHref('/dashboards/global') 
        },
      ]
    },
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
                <div key={item.name} className="relative group">
                  {item.children ? (
                    <>
                      <button className="text-gray-700 hover:text-paypro-600 font-medium transition-colors">
                        {item.name}
                      </button>
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-paypro-50 hover:text-paypro-600"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-paypro-600 font-medium transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={currentLocale} />
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
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <div className="px-3 py-2 text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="pl-6 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-paypro-600"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-paypro-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="px-3 py-2 border-t border-gray-200 mt-4 pt-4">
                <LanguageSwitcher currentLocale={currentLocale} />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 