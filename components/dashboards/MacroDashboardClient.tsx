'use client'

import React from 'react'
import useSWR from 'swr'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'
import ChartCard from '@/components/dashboards/ChartCard'
import MetricBox from '@/components/dashboards/MetricBox'
import UpdateCalendar from '@/components/dashboards/UpdateCalendar'
import { MacroData } from '@/lib/macroSources'
import { getTranslation } from '@/lib/translations'
import { Locale } from '@/i18n.config'
import dayjs from 'dayjs'

interface MacroDashboardClientProps {
  locale: Locale
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Mock historical data for charts - 2 års period
const historicalGDP = [
  { period: 'Q1 2023', value: 0.8 },
  { period: 'Q2 2023', value: 0.4 },
  { period: 'Q3 2023', value: -0.1 },
  { period: 'Q4 2023', value: 0.3 },
  { period: 'Q1 2024', value: 0.6 },
  { period: 'Q2 2024', value: 0.2 },
  { period: 'Q3 2024', value: 0.3 },
  { period: 'Q4 2024', value: 0.1 },
  { period: 'Q1 2025', value: -0.2 }, // FIXAT: BNP minskade -0.2% enligt SCB
]

const historicalInflation = [
  { period: 'Q1 2023', value: 8.2 },
  { period: 'Q2 2023', value: 7.1 },
  { period: 'Q3 2023', value: 5.4 },
  { period: 'Q4 2023', value: 4.2 },
  { period: 'Q1 2024', value: 3.8 },
  { period: 'Q2 2024', value: 3.1 },
  { period: 'Q3 2024', value: 2.7 },
  { period: 'Q4 2024', value: 2.4 },
  { period: 'Q1 2025', value: 2.3 }, // FIXAT: KPI 2.3% enligt SCB/Reuters maj 2025
]

const historicalRates = [
  { period: 'Q1 2023', repo: 1.25, sek_eur: 11.4, usd_sek: 10.8, usd_eur: 0.98 },
  { period: 'Q2 2023', repo: 1.75, sek_eur: 11.6, usd_sek: 11.1, usd_eur: 0.96 },
  { period: 'Q3 2023', repo: 2.25, sek_eur: 11.5, usd_sek: 11.3, usd_eur: 0.95 },
  { period: 'Q4 2023', repo: 2.75, sek_eur: 11.2, usd_sek: 11.5, usd_eur: 0.95 },
  { period: 'Q1 2024', repo: 2.75, sek_eur: 11.1, usd_sek: 11.6, usd_eur: 0.94 },
  { period: 'Q2 2024', repo: 2.5, sek_eur: 11.0, usd_sek: 11.7, usd_eur: 0.93 },
  { period: 'Q3 2024', repo: 2.5, sek_eur: 10.9, usd_sek: 11.8, usd_eur: 0.92 },
  { period: 'Q4 2024', repo: 2.25, sek_eur: 10.943, usd_sek: 11.75, usd_eur: 0.93 },
  { period: 'Q1 2025', repo: 2.25, sek_eur: 10.946, usd_sek: 9.60, usd_eur: 0.88 }, // FIXAT: Korrekta kurser 2025-06-10
]

export default function MacroDashboardClient({ locale }: MacroDashboardClientProps) {
  const { data: macroData, error, isLoading, mutate } = useSWR<MacroData>('/api/macro', fetcher, {
    refreshInterval: 30000, // 30 seconds
    revalidateOnFocus: false,
    dedupingInterval: 10000
  })

  const loading = isLoading
  const hasError = error

  const formatValue = (value: number | null, suffix: string = '', decimals: number = 2) => {
    if (value === null) return 'N/A'
    return `${value.toFixed(decimals)}${suffix}`
  }

  const getChangeType = (value: number | null) => {
    if (value === null) return 'neutral'
    return value >= 0 ? 'positive' : 'negative'
  }

  const manualRefresh = async () => {
    try {
      await mutate()
      // Force a hard refresh after mutate completes
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error('Manual refresh failed:', error)
    }
  }

  const t = (key: keyof import('@/lib/translations').Translations) => getTranslation(key, locale)

  return (
    <main className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('macro.title')}
              </h1>
              <p className="text-lg text-gray-600">
                {t('macro.description')}
              </p>
              {macroData?.updated && (
                <p className="text-sm text-gray-500 mt-2">
                  {t('macro.updated')} {dayjs(macroData.updated).format('YYYY-MM-DD HH:mm:ss')}
                </p>
              )}
            </div>
            
            {/* Update controls */}
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 text-sm rounded-full flex items-center space-x-2 ${
                hasError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  hasError ? 'bg-red-500' : 'bg-green-500 animate-pulse'
                }`}></div>
                <span>{hasError ? t('macro.error') : t('macro.live')}</span>
              </div>
              
              <button
                onClick={manualRefresh}
                disabled={loading}
                className="px-3 py-1 text-sm bg-paypro-600 text-white rounded hover:bg-paypro-700 disabled:opacity-50"
              >
                {loading ? t('macro.refreshing') : t('macro.refresh')}
              </button>
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
                title={t('metric.gdp')}
                value={formatValue(macroData?.gdpQoQ ?? null, '%')}
                change={macroData?.gdpQoQ !== null && macroData?.gdpQoQ !== undefined ? `${macroData.gdpQoQ > 0 ? '+' : ''}${macroData.gdpQoQ.toFixed(2)}%` : undefined}
                changeType={getChangeType(macroData?.gdpQoQ ?? null)}
                description={t('metric.gdp.desc')}
              />
              <MetricBox
                title={t('metric.inflation')}
                value={formatValue(macroData?.inflationYoY ?? null, '%')}
                change={macroData?.inflationYoY !== null && macroData?.inflationYoY !== undefined ? `${macroData.inflationYoY > 0 ? '+' : ''}${macroData.inflationYoY.toFixed(2)}%` : undefined}
                changeType={getChangeType(macroData?.inflationYoY ?? null)}
                description={t('metric.inflation.desc')}
              />
              <MetricBox
                title={t('metric.unemployment')}
                value={formatValue(macroData?.unemployment ?? null, '%')}
                changeType={getChangeType(macroData?.unemployment ?? null)}
                description={t('metric.unemployment.desc')}
              />
              <MetricBox
                title={t('metric.repo_rate')}
                value={formatValue(macroData?.repoRate ?? null, '%')}
                changeType="neutral"
                description={t('metric.repo_rate.desc')}
              />
            </>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* GDP Growth Chart */}
          <ChartCard title={t('chart.gdp.title')} description={t('chart.gdp.subtitle')}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={historicalGDP}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, t('metric.gdp')]} />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Inflation Chart */}
          <ChartCard title={t('chart.inflation.title')} description={t('chart.inflation.subtitle')}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalInflation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, t('metric.inflation')]} />
                <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Currency & Rates Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Exchange Rates Chart */}
          <ChartCard title={t('chart.rates.title')} description={t('chart.rates.subtitle')}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    const labels: { [key: string]: string } = {
                      'sek_eur': 'SEK/EUR',
                      'usd_sek': 'USD/SEK'
                    }
                    return [`${value}`, labels[name] || name]
                  }} 
                />
                <Line type="monotone" dataKey="sek_eur" stroke="#2563eb" strokeWidth={2} name="sek_eur" />
                <Line type="monotone" dataKey="usd_sek" stroke="#dc2626" strokeWidth={2} name="usd_sek" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Interest Rate Chart */}
          <ChartCard title={t('chart.repo.title')} description={t('chart.repo.subtitle')}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={historicalRates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, t('metric.repo_rate')]} />
                <Area type="monotone" dataKey="repo" stroke="#059669" fill="#059669" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Live Swedish Economic Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="card relative">
            <div className="absolute top-3 right-3">
              <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('metric.repo_rate')}
            </h3>
            <div className="text-3xl font-bold text-paypro-600 mb-2">
              {formatValue(macroData?.repoRate ?? null, '%')}
            </div>
            <p className="text-sm text-gray-600">
              {t('metric.repo_rate.desc')}
            </p>
          </div>

          <div className="card relative">
            <div className="absolute top-3 right-3">
              <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('metric.sek_eur')}
            </h3>
            <div className="text-3xl font-bold text-paypro-600 mb-2">
              {formatValue(macroData?.sekEur ?? null)}
            </div>
            <p className="text-sm text-gray-600">
              {t('metric.sek_eur.desc')}
            </p>
          </div>

          <div className="card relative">
            <div className="absolute top-3 right-3">
              <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('metric.usd_sek')}
            </h3>
            <div className="text-3xl font-bold text-paypro-600 mb-2">
              {formatValue(macroData?.usdSek ?? null)}
            </div>
            <p className="text-sm text-gray-600">
              {t('metric.usd_sek.desc')}
            </p>
          </div>

          <div className="card relative">
            <div className="absolute top-3 right-3">
              <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('metric.usd_eur')}
            </h3>
            <div className="text-3xl font-bold text-paypro-600 mb-2">
              {formatValue(macroData?.usdEur ?? null)}
            </div>
            <p className="text-sm text-gray-600">
              {t('metric.usd_eur.desc')}
            </p>
          </div>

          <div className="card relative">
            <div className="absolute top-3 right-3">
              <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('metric.ecb_rate')}
            </h3>
            <div className="text-3xl font-bold text-paypro-600 mb-2">
              {formatValue(macroData?.ecbRate ?? null, '%')}
            </div>
            <p className="text-sm text-gray-600">
              {t('metric.ecb_rate.desc')}
            </p>
          </div>
        </div>

        {/* Update Calendar and Data Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Update Calendar */}
          <UpdateCalendar locale={locale} />

          {/* Data Sources */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('sources.title')}
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
                    {t('sources.live.title')}
                  </h4>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      {t('sources.live.desc')}
                    </p>
                    {macroData?.updated && (
                      <p className="mt-1">
                        <strong>{t('sources.updated')}</strong> {dayjs(macroData.updated).format('YYYY-MM-DD HH:mm:ss')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 