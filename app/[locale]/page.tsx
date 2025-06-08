import React from 'react'
import Head from 'next/head'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { Locale, i18n } from '@/i18n.config'
import { getTranslation } from '@/lib/translations'

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = (key: keyof import('@/lib/translations').Translations) => getTranslation(key, locale)

  return (
    <>
      <Head>
        <title>PayPro.se - {locale === 'sv' ? 'Ekonomisk analys och makrodata' : 'Economic Analysis and Macro Data'}</title>
        <meta name="description" content={locale === 'sv' 
          ? 'Sveriges ledande plattform för ekonomisk analys, makrodata och finansiell rådgivning.' 
          : 'Sweden\'s leading platform for economic analysis, macro data and financial advisory.'
        } />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="container-custom">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <LanguageSwitcher currentLocale={locale} />
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {locale === 'sv' ? (
                <>PayPro.se - <span className="text-paypro-600">Sveriges ekonomiska nav</span></>
              ) : (
                <>PayPro.se - <span className="text-paypro-600">Sweden's Economic Hub</span></>
              )}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {locale === 'sv' 
                ? 'Live ekonomisk data, djupgående analyser och professionell rådgivning för investerare och beslutsfattare.'
                : 'Live economic data, in-depth analysis and professional advisory for investors and decision makers.'
              }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={locale === 'sv' ? '/dashboards/makro' : '/en/dashboards/makro'}
                className="btn-primary text-lg px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                {locale === 'sv' ? '📊 Se Makro Dashboard' : '📊 View Macro Dashboard'}
              </a>
              <a 
                href={locale === 'sv' ? '/blog' : '/en/blog'}
                className="bg-white text-paypro-600 border-2 border-paypro-600 text-lg px-8 py-4 rounded-lg font-semibold hover:bg-paypro-50 transition-colors"
              >
                {locale === 'sv' ? '📰 Läs Analyser' : '📰 Read Analysis'}
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === 'sv' ? 'Live Makrodata' : 'Live Macro Data'}
              </h3>
              <p className="text-gray-600">
                {locale === 'sv' 
                  ? 'Realtidsdata från SCB och Riksbank. BNP, inflation, arbetslöshet och valutakurser uppdateras kontinuerligt.'
                  : 'Real-time data from SCB and Riksbank. GDP, inflation, unemployment and exchange rates updated continuously.'
                }
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === 'sv' ? 'Djupgående Analyser' : 'In-Depth Analysis'}
              </h3>
              <p className="text-gray-600">
                {locale === 'sv' 
                  ? 'Professionella marknadsanalyser och investeringsinsikter från vårt expertteam och AI-assistenter.'
                  : 'Professional market analysis and investment insights from our expert team and AI assistants.'
                }
              </p>
            </div>

            <div className="card text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">
                {locale === 'sv' ? 'Precisionsverktyg' : 'Precision Tools'}
              </h3>
              <p className="text-gray-600">
                {locale === 'sv' 
                  ? 'Avancerade dashboard och visualiseringar för att förstå komplexa ekonomiska samband.'
                  : 'Advanced dashboards and visualizations to understand complex economic relationships.'
                }
              </p>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              {locale === 'sv' ? 'PayPro i siffror' : 'PayPro in Numbers'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-paypro-600">8+</div>
                <div className="text-gray-600">
                  {locale === 'sv' ? 'Ekonomiska Indikatorer' : 'Economic Indicators'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-paypro-600">30s</div>
                <div className="text-gray-600">
                  {locale === 'sv' ? 'Uppdateringsfrekvens' : 'Update Frequency'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-paypro-600">2</div>
                <div className="text-gray-600">
                  {locale === 'sv' ? 'Språk Stödda' : 'Languages Supported'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-paypro-600">24/7</div>
                <div className="text-gray-600">
                  {locale === 'sv' ? 'Tillgänglighet' : 'Availability'}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              {locale === 'sv' ? 'Börja utforska Sveriges ekonomi idag' : 'Start exploring Sweden\'s economy today'}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {locale === 'sv' 
                ? 'Få tillgång till professionell ekonomisk analys och live-data.'
                : 'Get access to professional economic analysis and live data.'
              }
            </p>
            <a 
              href={locale === 'sv' ? '/dashboards/makro' : '/en/dashboards/makro'}
              className="btn-primary text-lg px-8 py-4 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              {locale === 'sv' ? 'Kom igång →' : 'Get Started →'}
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
} 