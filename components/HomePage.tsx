import React from 'react'
import Link from 'next/link'
import { Locale } from '@/i18n.config'

interface HomePageProps {
  locale: Locale
  t: (key: string) => string
}

export default function HomePage({ locale, t }: HomePageProps) {
  // Create locale-aware URLs
  const getLocalizedHref = (path: string) => {
    if (locale === 'en') {
      return path === '/' ? '/en' : `/en${path}`
    }
    return path
  }

  return (
    <main className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container-custom">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            PayPro.se - <span className="text-paypro-600">{t('hero.subtitle')}</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={getLocalizedHref('/dashboards/makro')}
              className="btn-primary text-lg px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              {t('hero.cta_dashboard')}
            </Link>
            <Link 
              href={getLocalizedHref('/blog')}
              className="bg-white text-paypro-600 border-2 border-paypro-600 text-lg px-8 py-4 rounded-lg font-semibold hover:bg-paypro-50 transition-colors"
            >
              {t('hero.cta_blog')}
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-3">
              {t('features.live_data.title')}
            </h3>
            <p className="text-gray-600">
              {t('features.live_data.description')}
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-3">
              {t('features.analysis.title')}
            </h3>
            <p className="text-gray-600">
              {t('features.analysis.description')}
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-3">
              {t('features.tools.title')}
            </h3>
            <p className="text-gray-600">
              {t('features.tools.description')}
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t('stats.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-paypro-600">8+</div>
              <div className="text-gray-600">
                {t('stats.indicators')}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-paypro-600">30s</div>
              <div className="text-gray-600">
                {t('stats.frequency')}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-paypro-600">2</div>
              <div className="text-gray-600">
                {t('stats.languages')}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-paypro-600">24/7</div>
              <div className="text-gray-600">
                {t('stats.availability')}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('cta.description')}
          </p>
          <Link 
            href={getLocalizedHref('/dashboards/makro')}
            className="btn-primary text-lg px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            {t('cta.button')}
          </Link>
        </div>
      </div>
    </main>
  )
} 