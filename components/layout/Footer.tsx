import React from 'react'
import Link from 'next/link'
import { Locale } from '@/i18n.config'
import { getTranslation } from '@/lib/translations'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

interface FooterProps {
  locale: Locale
}

const Footer = ({ locale }: FooterProps) => {
  const currentYear = new Date().getFullYear()
  
  const t = (key: keyof import('@/lib/translations').Translations) => getTranslation(key, locale)
  
  // Create locale-aware URLs
  const getLocalizedHref = (path: string) => {
    if (locale === 'en') {
      return path === '/' ? '/en' : `/en${path}`
    }
    return path
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-paypro-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold">PayPro.se</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {locale === 'sv' 
                ? 'Ledande analys och insikter om betalningar, ekonomi och finansiella trender i Sverige och världen.'
                : 'Leading analysis and insights on payments, economics and financial trends in Sweden and globally.'
              }
            </p>
            
            {/* Contact */}
            <div className="text-gray-400">
              <p>© {currentYear} PayPro.se. {locale === 'sv' ? 'Alla rättigheter förbehållna.' : 'All rights reserved.'}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {t('nav.navigation')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={getLocalizedHref('/')} className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/blog')} className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.blog')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/dashboards/makro')} className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.macro')}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedHref('/dashboards/swish')} className="text-gray-300 hover:text-white transition-colors">
                  {locale === 'sv' ? 'Svenska Betalningar' : 'Swedish Payments'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Language Switcher */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              {locale === 'sv' ? 'Resurser' : 'Resources'}
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {locale === 'sv' ? 'Om oss' : 'About us'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {locale === 'sv' ? 'Kontakt' : 'Contact'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {locale === 'sv' ? 'Integritetspolicy' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {locale === 'sv' ? 'Användarvillkor' : 'Terms of Service'}
                </a>
              </li>
            </ul>
            
            {/* Language Switcher in Footer */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-3 text-gray-400">
                {locale === 'sv' ? 'Språk' : 'Language'}
              </h4>
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            {locale === 'sv' 
              ? 'Utvecklad med passion för ekonomisk transparens och innovation.'
              : 'Built with passion for economic transparency and innovation.'
            }
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 