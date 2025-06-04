import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChartCard from '@/components/dashboards/ChartCard'
import MetricBox from '@/components/dashboards/MetricBox'
import { MetricData } from '@/lib/dataFetcher'

const GlobalDashboard = () => {
  const [loading, setLoading] = useState(true)

  // Mock global payment trends data
  const digitalPaymentTrends = [
    { year: '2020', percentage: 68 },
    { year: '2021', percentage: 74 },
    { year: '2022', percentage: 79 },
    { year: '2023', percentage: 83 },
    { year: '2024', percentage: 87 },
  ]

  const cryptoAdoption = [
    { month: 'Jan', volume: 1200 },
    { month: 'Feb', volume: 1350 },
    { month: 'Mar', volume: 1180 },
    { month: 'Apr', volume: 1420 },
    { month: 'Maj', volume: 1560 },
    { month: 'Jun', volume: 1340 },
  ]

  const globalMetrics: MetricData[] = [
    {
      title: 'Digitala Betalningar',
      value: '87',
      unit: '%',
      change: '+4%',
      changeType: 'positive',
      description: 'Av alla transaktioner globalt'
    },
    {
      title: 'CBDC Projekt',
      value: '134',
      unit: 'länder',
      change: '+12',
      changeType: 'positive',
      description: 'Pilot eller utvecklingsfas'
    },
    {
      title: 'Krypto Volym',
      value: '1.34',
      unit: 'Biljoner $',
      change: '-5.2%',
      changeType: 'negative',
      description: 'Månatlig handelsvolym'
    }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500)
  }, [])

  return (
    <>
      <Head>
        <title>Globala Betaltrender Dashboard - PayPro.se</title>
        <meta name="description" content="Analys av globala betalningsteknologier och finansiella innovationer." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="py-8 bg-gray-50 min-h-screen">
        <div className="container-custom">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Globala Betaltrender Dashboard</h1>
            <p className="text-lg text-gray-600">Internationella betalningsteknologier och framtidstrender</p>
          </div>

          {/* Global Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {globalMetrics.map((metric, index) => (
              <MetricBox key={index} {...metric} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Digital Payment Adoption */}
            <ChartCard
              title="Digital Betalningsadoption Globalt"
              description="Andel digitala betalningar av totala transaktioner (%)"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paypro-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={digitalPaymentTrends}>
                    <defs>
                      <linearGradient id="colorDigital" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'Digitala betalningar']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#0ea5e9" 
                      fillOpacity={1} 
                      fill="url(#colorDigital)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Crypto Trading Volume */}
            <ChartCard
              title="Global Kryptovaluta Handelsvolym"
              description="Månatlig volym i miljarder USD, 2024"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cryptoAdoption}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`$${value}B`, 'Handelsvolym']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* CBDC Status */}
          <div className="mt-8 card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">CBDC Status Världen</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">11</div>
                <div className="text-sm text-gray-600">Lanserade</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">36</div>
                <div className="text-sm text-gray-600">Pilot</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">87</div>
                <div className="text-sm text-gray-600">Utveckling</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">200+</div>
                <div className="text-sm text-gray-600">Utredning</div>
              </div>
            </div>
          </div>

          {/* Key Trends */}
          <div className="mt-8 card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Globala Trender 2024</h3>
            <div className="prose prose-sm text-gray-600">
              <ul>
                <li><strong>CBDC Acceleration:</strong> 134 länder utvecklar eller pilottestar digitala centralbanksvalutor</li>
                <li><strong>Realtidsbetalningar:</strong> FedNow, PIX, och UPI driver adoption av direktbetalningar</li>
                <li><strong>Krypto Institutionalisering:</strong> ETF-godkännanden och företagsadoption ökar acceptans</li>
                <li><strong>Open Banking:</strong> PSD2 och liknande regleringar öppnar för fintech-innovation</li>
                <li><strong>AI i Betalningar:</strong> Förbättrad fraud-detection och personaliserade tjänster</li>
              </ul>
            </div>
          </div>

          {/* Regional Spotlight */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spotlight: Kina</h3>
              <div className="prose prose-sm text-gray-600">
                <p><strong>Digital Yuan (DCEP):</strong> Världens största CBDC-pilot med över 260 miljoner användare.</p>
                <p><strong>Super Apps:</strong> WeChat Pay och Alipay dominerar med 90%+ marknadsandel.</p>
                <p><strong>Cross-border:</strong> mBridge-projektet för internationella CBDC-betalningar.</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spotlight: Indien</h3>
              <div className="prose prose-sm text-gray-600">
                <p><strong>UPI Success:</strong> 13+ miljarder transaktioner per månad via Unified Payments Interface.</p>
                <p><strong>Financial Inclusion:</strong> 80% vuxna har nu bankkonto, upp från 35% 2011.</p>
                <p><strong>Digital Rupee:</strong> CBDC-pilot expanderar med fokus på grossistmarknaden.</p>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="mt-8 card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datakällor</h3>
            <div className="prose prose-sm text-gray-600">
              <ul>
                <li><strong>CBDC Data:</strong> Atlantic Council CBDC Tracker</li>
                <li><strong>Digital Payment Trends:</strong> McKinsey Global Payments Report</li>
                <li><strong>Crypto Data:</strong> CoinGecko, CoinMarketCap</li>
                <li><strong>Regional Data:</strong> Lokala centralbanker och statistikbyråer</li>
                <li><strong>Uppdateringsfrekvens:</strong> Månadsvis eller vid större händelser</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default GlobalDashboard 