import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChartCard from '@/components/dashboards/ChartCard'
import MetricBox from '@/components/dashboards/MetricBox'
import { fetchEconomicData, fetchKeyMetrics, EconomicData, MetricData } from '@/lib/dataFetcher'

const MakroDashboard = () => {
  const [gdpData, setGdpData] = useState<EconomicData[]>([])
  const [inflationData, setInflationData] = useState<EconomicData[]>([])
  const [keyMetrics, setKeyMetrics] = useState<MetricData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gdp, inflation, metrics] = await Promise.all([
          fetchEconomicData('gdp'),
          fetchEconomicData('inflation'),
          fetchKeyMetrics()
        ])
        setGdpData(gdp)
        setInflationData(inflation)
        setKeyMetrics(metrics.slice(0, 3)) // Show first 3 metrics
      } catch (error) {
        console.error('Error loading macro data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <>
      <Head>
        <title>Makroekonomi Dashboard - PayPro.se</title>
        <meta name="description" content="Svenska ekonomiska nyckeltal och makroekonomisk analys i realtid." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="py-8 bg-gray-50 min-h-screen">
        <div className="container-custom">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Makroekonomi Dashboard</h1>
            <p className="text-lg text-gray-600">Svenska ekonomiska nyckeltal och trender</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="metric-box animate-pulse">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </>
            ) : (
              keyMetrics.map((metric, index) => (
                <MetricBox key={index} {...metric} />
              ))
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* GDP Chart */}
            <ChartCard
              title="BNP Utveckling"
              description="Bruttonationalprodukt i miljoner SEK, kvartalstakt"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paypro-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gdpData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toLocaleString()} MSEK`, 'BNP']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0284c7" 
                      strokeWidth={3}
                      dot={{ fill: '#0284c7', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Inflation Chart */}
            <ChartCard
              title="Inflation (KPI)"
              description="Konsumentprisindex, årlig procentuell förändring"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paypro-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inflationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Inflation']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#dc2626" 
                      strokeWidth={3}
                      dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* Data Sources */}
          <div className="mt-8 card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datakällor och Notiser</h3>
            <div className="prose prose-sm text-gray-600">
              <ul>
                <li><strong>BNP-data:</strong> Statistiska Centralbyrån (SCB), kvartalsvisa nationalräkenskaper</li>
                <li><strong>Inflation:</strong> Statistiska Centralbyrån (SCB), konsumentprisindex (KPI)</li>
                <li><strong>Reporänta:</strong> Sveriges Riksbank, penningpolitiska beslut</li>
                <li><strong>Uppdateringsfrekvens:</strong> Data uppdateras när nya officiella siffror publiceras</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default MakroDashboard 