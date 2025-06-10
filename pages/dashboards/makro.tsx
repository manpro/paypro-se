import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import Header from '@/components/layout/Header'
import { MacroData, getMacro } from '@/lib/macroSources'
import { Locale } from '@/i18n.config'
import dayjs from 'dayjs'

interface MacroPageProps {
  macroData: MacroData
  locale: Locale
}

// SERVER-SIDE RENDERING för att säkerställa bot-tillgänglighet
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Hämta makrodata på servern
    const macroData = await getMacro()
    
    // Sätt locale baserat på query eller default till 'sv'
    const locale = (context.query.locale as Locale) || 'sv'
    
    return {
      props: {
        macroData,
        locale,
      },
    }
  } catch (error) {
    console.error('Error fetching macro data for SSR:', error)
    
    // Fallback data om API:er inte fungerar
    const fallbackData: MacroData = {
      updated: dayjs().toISOString(),
      gdpQoQ: -0.20,      // BNP Q1 2025 (SCB)
      inflationYoY: 2.30, // KPI maj 2025 (SCB)
      unemployment: 8.70, // AKU säsongrensad (SCB)
      ecbRate: 2.00,      // ECB deposit facility rate
      repoRate: 2.25,     // Riksbank
      sekEur: 10.946,     // Riksbank
      usdSek: 9.60,       // Riksbank
      usdEur: 0.88,       // Riksbank
    }
    
    return {
      props: {
        macroData: fallbackData,
        locale: 'sv' as Locale,
      },
    }
  }
}

export default function MacroPage({ macroData, locale }: MacroPageProps) {
  const t = {
    title: locale === 'sv' ? 'Makroekonomisk Dashboard' : 'Macroeconomic Dashboard',
    description: locale === 'sv' 
      ? 'Svensk ekonomisk data i realtid - BNP, inflation, arbetslöshet, reporänta och valutakurser'
      : 'Swedish economic data in real-time - GDP, inflation, unemployment, repo rate and exchange rates',
    gdp: locale === 'sv' ? 'BNP Tillväxt' : 'GDP Growth',
    inflation: locale === 'sv' ? 'Inflation (KPI)' : 'Inflation (CPI)',
    unemployment: locale === 'sv' ? 'Arbetslöshet' : 'Unemployment',
    repoRate: locale === 'sv' ? 'Reporänta' : 'Repo Rate',
    ecbRate: locale === 'sv' ? 'ECB-ränta' : 'ECB Rate',
    currency: locale === 'sv' ? 'Valutakurser' : 'Exchange Rates',
    lastUpdated: locale === 'sv' ? 'Senast uppdaterad' : 'Last updated',
    source: locale === 'sv' ? 'Källa: Riksbank & SCB' : 'Source: Riksbank & SCB'
  }

  const formatValue = (value: number | null, suffix: string = '', decimals: number = 2) => {
    if (value === null) return 'N/A'
    return `${value.toFixed(decimals)}${suffix}`
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": t.title,
    "description": t.description,
    "url": "https://paypro.se/dashboards/makro",
    "creator": {
      "@type": "Organization",
      "name": "PayPro.se"
    },
    "dateModified": macroData.updated,
    "datePublished": macroData.updated,
    "keywords": [
      "svensk ekonomi", "BNP", "inflation", "arbetslöshet", "reporänta", 
      "valutakurser", "ekonomisk data", "makroekonomi", "finansiell analys"
    ],
    "distribution": [
      {
        "@type": "DataDownload",
        "encodingFormat": "application/json",
        "contentUrl": "https://paypro.se/api/macro"
      }
    ]
  }

  return (
    <>
      <Head>
        <title>{t.title} | PayPro.se</title>
        <meta name="description" content={t.description} />
        <meta name="keywords" content="svensk ekonomi, BNP, inflation, arbetslöshet, reporänta, valutakurser, ekonomisk data" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://paypro.se/dashboards/makro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.title} />
        <meta name="twitter:description" content={t.description} />
        
        {/* Structured Data för bättre SEO */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        <link rel="canonical" href="https://paypro.se/dashboards/makro" />
      </Head>

      <Header locale={locale} />
      
      <main className="py-8 bg-gray-50 min-h-screen">
        <div className="container-custom">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {t.description}
            </p>
            <p className="text-sm text-gray-500">
              {t.lastUpdated}: {dayjs(macroData.updated).format('YYYY-MM-DD HH:mm:ss')} | {t.source}
            </p>
          </div>

          {/* Key Economic Indicators - BOT-READABLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t.gdp}
              </h2>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatValue(macroData.gdpQoQ, '%')}
              </div>
              <p className="text-sm text-gray-600">
                Kvartal över kvartal, säsongrensad
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t.inflation}
              </h2>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {formatValue(macroData.inflationYoY, '%')}
              </div>
              <p className="text-sm text-gray-600">
                Årlig förändring, konsumentprisindex
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t.unemployment}
              </h2>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {formatValue(macroData.unemployment, '%')}
              </div>
              <p className="text-sm text-gray-600">
                Enligt AKU, säsongrensad
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t.repoRate}
              </h2>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatValue(macroData.repoRate, '%')}
              </div>
              <p className="text-sm text-gray-600">
                Sveriges Riksbank, senaste beslut
              </p>
            </div>
          </div>

          {/* Currency Exchange Rates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                SEK/EUR
              </h2>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatValue(macroData.sekEur)}
              </div>
              <p className="text-sm text-gray-600">
                Svenska kronor per euro
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                USD/SEK
              </h2>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatValue(macroData.usdSek)}
              </div>
              <p className="text-sm text-gray-600">
                US dollar per svenska krona
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                USD/EUR
              </h2>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatValue(macroData.usdEur)}
              </div>
              <p className="text-sm text-gray-600">
                US dollar per euro
              </p>
            </div>
          </div>

          {/* ECB Rate Section */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {t.ecbRate}
              </h2>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatValue(macroData.ecbRate, '%')}
              </div>
              <p className="text-sm text-gray-600">
                ECB deposit facility rate, senaste beslut
              </p>
            </div>
          </div>

          {/* Raw Data Section for Scrapers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Raw Economic Data (JSON)
            </h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
              {JSON.stringify(macroData, null, 2)}
            </pre>
          </div>

          {/* Data Sources */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Datakällor och API
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Riksbank API:</strong> Reporänta och valutakurser</li>
              <li>• <strong>SCB (Statistiska centralbyrån):</strong> BNP, inflation, arbetslöshet</li>
              <li>• <strong>ECB Data Portal:</strong> Europeiska centralbankens räntor</li>
              <li>• <strong>Live API endpoint:</strong> <a href="/api/macro" className="text-blue-600 hover:underline">/api/macro</a></li>
              <li>• <strong>Uppdateringsfrekvens:</strong> Realtid via API</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  )
} 