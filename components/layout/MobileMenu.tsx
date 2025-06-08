'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Locale } from '@/i18n.config'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

interface NavigationItem {
  name: string
  href: string
}

interface MobileMenuProps {
  navigation: NavigationItem[]
  locale: Locale
}

const MobileMenu = ({ navigation, locale }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="py-4 px-4">
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
        </div>
      )}
    </div>
  )
}

export default MobileMenu 