import React from 'react'
import Head from 'next/head'
import useSWR from 'swr'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChartCard from '@/components/dashboards/ChartCard'
import MetricBox from '@/components/dashboards/MetricBox'
import { MacroData } from '@/lib/macroSources'
import dayjs from 'dayjs'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const SverigeMakroDashboard = () => {
  const { data: macroData, error, isLoading, mutate } = useSWR<MacroData>('/api/macro', fetcher, {
    refreshInterval: 30000, // 30 seconds
    revalidateOnFocus: false,
    dedupingInterval: 10000
  })

  const loading = isLoading
  const hasError = error

  const formatValue = (value: number | null, suffix: string = '') => {
    if (value === null) return '⚠️'
    return `${value.toFixed(1)}${suffix}`
  }

  const getChangeType = (value: number | null) => {
    if (value === null) return 'neutral'
    return value >= 0 ? 'positive' : 'negative'
  }

  const manualRefresh = () => {
    mutate()
  }

  return (
    <>
      <Head>
        <title>Sveriges Makroekonomi Dashboard - PayPro.se</title>
        <meta name="description" content="Sveriges ekonomiska nyckeltal och makroekonomisk analys i realtid - BNP, inflation, arbetslöshet och bostadspriser." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="py-8 bg-gray-50 min-h-screen">
        <div className="container-custom">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  🇸🇪 Sveriges Makroekonomi Dashboard
                </h1>
                <p className="text-lg text-gray-600">
                  Kompletta ekonomiska nyckeltal och trender för den svenska ekonomin
                </p>
                {macroData?.updated && (
                  <p className="text-sm text-gray-500 mt-2">
                    Senast uppdaterad: {dayjs(macroData.updated).format('YYYY-MM-DD HH:mm:ss')}
                  </p>
                )}
              </div>
              
              {/* Update controls */}
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 text-sm rounded-full flex items-center space-x-2 ${
                    hasError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      hasError ? 'bg-red-500' : 'bg-green-500 animate-pulse'
                    }`}></div>
                    <span>{hasError ? 'Error' : 'Live'}</span>
                  </div>
                  
                  <button
                    onClick={manualRefresh}
                    disabled={loading}
                    className="px-3 py-1 text-sm bg-paypro-600 text-white rounded hover:bg-paypro-700 disabled:opacity-50"
                  >
                    {loading ? 'Uppdaterar...' : 'Uppdatera'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading && !macroData ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="metric-box animate-pulse">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <MetricBox
                  title="BNP Tillväxt"
                  value={formatValue(macroData?.gdpQoQ || null, '%')}
                  change={macroData?.gdpQoQ ? `${macroData.gdpQoQ > 0 ? '+' : ''}${macroData.gdpQoQ.toFixed(1)}%` : undefined}
                  changeType={getChangeType(macroData?.gdpQoQ || null)}
                  description="Kvartal över kvartal"
                />
                <MetricBox
                  title="Inflation (KPI)"
                  value={formatValue(macroData?.inflationYoY || null, '%')}
                  change={macroData?.inflationYoY ? `${macroData.inflationYoY > 0 ? '+' : ''}${macroData.inflationYoY.toFixed(1)}%` : undefined}
                  changeType={getChangeType(macroData?.inflationYoY || null)}
                  description="Årlig förändring"
                />
                <MetricBox
                  title="Arbetslöshet"
                  value={formatValue(macroData?.unemployment || null, '%')}
                  changeType={getChangeType(macroData?.unemployment || null)}
                  description="Senaste månaden"
                />
                <MetricBox
                  title="Reporänta"
                  value={formatValue(macroData?.repoRate || null, '%')}
                  changeType="neutral"
                  description="Senaste beslut"
                />
              </>
            )}
          </div>



          {/* Live Swedish Economic Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card relative">
              <div className="absolute top-3 right-3">
                <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Riksbankens Reporänta
              </h3>
              <div className="text-3xl font-bold text-paypro-600 mb-2">
                {formatValue(macroData?.repoRate || null, '%')}
              </div>
              <p className="text-sm text-gray-600">
                Senaste beslut från Sveriges Riksbank
              </p>
            </div>

            <div className="card relative">
              <div className="absolute top-3 right-3">
                <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kronkurs (SEK/EUR)
              </h3>
              <div className="text-3xl font-bold text-paypro-600 mb-2">
                {macroData?.sekEur ? macroData.sekEur.toFixed(2) : '⚠️'}
              </div>
              <p className="text-sm text-gray-600">
                Svenska kronor per euro
              </p>
            </div>

            <div className="card relative">
              <div className="absolute top-3 right-3">
                <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Skuldsättningsgrad
              </h3>
              <div className="text-3xl font-bold text-paypro-600 mb-2">
                {formatValue(macroData?.debtRatio || null, '%')}
              </div>
              <p className="text-sm text-gray-600">
                Hushållens skulder som andel av disponibel inkomst
              </p>
            </div>
          </div>

          {/* Data Sources */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Datakällor och Notiser - Sveriges Ekonomi
            </h3>
            
            {/* Live Data Information */}
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">
                    Live data från officiella källor
                  </h4>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      Data hämtas direkt från <strong>SCB</strong> och <strong>Sveriges Riksbank</strong> via deras officiella API:er. 
                      Data uppdateras automatiskt var 30:e sekund och cachas för optimal prestanda.
                    </p>
                    {macroData?.updated && (
                      <p className="mt-1">
                        <strong>Senast uppdaterad:</strong> {dayjs(macroData.updated).format('YYYY-MM-DD HH:mm:ss')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="prose prose-sm text-gray-600">
              <ul>
                <li><strong>BNP-data:</strong> Statistiska Centralbyrån (SCB), 
                    kvartalsvisa nationalräkenskaper för Sverige</li>
                <li><strong>Inflation:</strong> Statistiska Centralbyrån (SCB), 
                    konsumentprisindex (KPI) för Sverige</li>
                <li><strong>Arbetslöshet:</strong> Statistiska Centralbyrån (SCB), 
                    arbetskraftsundersökningen (AKU)</li>
                <li><strong>Bostadspriser:</strong> Statistiska Centralbyrån (SCB), 
                    fastighetsprisindex för Sverige</li>
                <li><strong>Reporänta:</strong> Sveriges Riksbank, 
                    penningpolitiska beslut</li>
                <li><strong>Valutakurser:</strong> Sveriges Riksbank, 
                    dagliga valutakurser</li>
                <li><strong>Uppdateringsfrekvens:</strong> Live data uppdateras var 30:e sekund 
                    med 24h cache för de flesta indikatorer, 6h cache för valutakurser</li>
                <li><strong>Felhantering:</strong> Vid API-fel visas ⚠️ och senast cachade värden används</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default SverigeMakroDashboard 