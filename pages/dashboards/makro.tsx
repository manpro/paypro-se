import React, { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChartCard from '@/components/dashboards/ChartCard'
import MetricBox from '@/components/dashboards/MetricBox'
import { fetchEconomicData, fetchKeyMetrics, fetchLiveEconomicData, EconomicData, MetricData } from '@/lib/dataFetcher'

const SverigeMakroDashboard = () => {
  const [gdpData, setGdpData] = useState<EconomicData[]>([])
  const [inflationData, setInflationData] = useState<EconomicData[]>([])
  const [unemploymentData, setUnemploymentData] = useState<EconomicData[]>([])
  const [housePriceData, setHousePriceData] = useState<EconomicData[]>([])
  const [keyMetrics, setKeyMetrics] = useState<MetricData[]>([])
  const [liveData, setLiveData] = useState({
    repoRate: 4.00,
    exchangeRate: 11.42,
    debtRatio: 185,
    timestamp: new Date().toISOString()
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isAutoUpdating, setIsAutoUpdating] = useState(true)

  // Load initial data
  const loadAllData = useCallback(async () => {
    try {
      const [gdp, inflation, unemployment, housePrice, metrics, live] = await Promise.all([
        fetchEconomicData('gdp'),
        fetchEconomicData('inflation'),
        fetchEconomicData('unemployment'),
        fetchEconomicData('house_prices'),
        fetchKeyMetrics(),
        fetchLiveEconomicData()
      ])
      
      setGdpData(gdp)
      setInflationData(inflation)
      setUnemploymentData(unemployment)
      setHousePriceData(housePrice)
      setKeyMetrics(metrics)
      setLiveData(live)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading Swedish macro data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load live data only (for frequent updates)
  const loadLiveData = useCallback(async () => {
    if (!isAutoUpdating) return
    try {
      const [live, metrics] = await Promise.all([
        fetchLiveEconomicData(),
        fetchKeyMetrics()
      ])
      setLiveData(live)
      setKeyMetrics(metrics)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error updating live data:', error)
    }
  }, [isAutoUpdating])

  // Load chart data (less frequent updates)
  const loadChartData = useCallback(async () => {
    if (!isAutoUpdating) return
    try {
      const [gdp, inflation, unemployment, housePrice] = await Promise.all([
        fetchEconomicData('gdp'),
        fetchEconomicData('inflation'),
        fetchEconomicData('unemployment'),
        fetchEconomicData('house_prices')
      ])
      
      setGdpData(gdp)
      setInflationData(inflation)
      setUnemploymentData(unemployment)
      setHousePriceData(housePrice)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error updating chart data:', error)
    }
  }, [isAutoUpdating])

  useEffect(() => {
    // Load all data initially
    loadAllData()

    // Set up automatic updates with different intervals
    const liveDataInterval = setInterval(loadLiveData, 30000) // 30 seconds
    const chartDataInterval = setInterval(loadChartData, 300000) // 5 minutes

    return () => {
      clearInterval(liveDataInterval)
      clearInterval(chartDataInterval)
    }
  }, [loadAllData, loadLiveData, loadChartData])

  const toggleAutoUpdate = () => {
    setIsAutoUpdating(!isAutoUpdating)
  }

  const manualRefresh = () => {
    setLoading(true)
    loadAllData()
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
              </div>
              
              {/* Auto-update controls */}
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleAutoUpdate}
                    className={`px-3 py-1 text-sm rounded-full flex items-center space-x-2 ${
                      isAutoUpdating 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      isAutoUpdating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    <span>{isAutoUpdating ? 'Live' : 'Pausad'}</span>
                  </button>
                  
                  <button
                    onClick={manualRefresh}
                    disabled={loading}
                    className="px-3 py-1 text-sm bg-paypro-600 text-white rounded hover:bg-paypro-700 disabled:opacity-50"
                  >
                    {loading ? 'Uppdaterar...' : 'Uppdatera'}
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  Senast uppdaterad: {lastUpdated.toLocaleString('sv-SE')}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
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
              keyMetrics.map((metric, index) => (
                <MetricBox key={index} {...metric} />
              ))
            )}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* GDP Chart */}
            <ChartCard
              title="BNP Utveckling Sverige"
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
                      formatter={(value: number) => [`${value.toLocaleString('sv-SE')} MSEK`, 'BNP']}
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
              title="Inflation Sverige (KPI)"
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
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Inflation']}
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

            {/* Unemployment Chart */}
            <ChartCard
              title="Arbetslöshet Sverige"
              description="Arbetslöshet som andel av arbetskraften, procent"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paypro-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={unemploymentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Arbetslöshet']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* House Prices Chart */}
            <ChartCard
              title="Bostadspriser Sverige"
              description="Fastighetsprisindex, årlig procentuell förändring"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paypro-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={housePriceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`, 'Prisförändring']}
                      labelStyle={{ color: '#374151' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* Live Swedish Economic Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="card relative">
              <div className="absolute top-3 right-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Riksbankens Reporänta
              </h3>
              <div className="text-3xl font-bold text-paypro-600 mb-2">
                {liveData.repoRate.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-600">
                Senaste beslut från Sveriges Riksbank
              </p>
            </div>

            <div className="card relative">
              <div className="absolute top-3 right-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kronkurs (SEK/EUR)
              </h3>
              <div className="text-3xl font-bold text-paypro-600 mb-2">
                {liveData.exchangeRate.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">
                Svenska kronor per euro
              </p>
            </div>

            <div className="card relative">
              <div className="absolute top-3 right-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Skuldsättningsgrad
              </h3>
              <div className="text-3xl font-bold text-paypro-600 mb-2">
                {liveData.debtRatio.toFixed(0)}%
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
            
            {/* CORS Information */}
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">
                    Information om datavisning
                  </h4>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Data som visas är <strong>realistiska simulerade värden</strong> baserade på verkliga svenska ekonomiska siffror. 
                      På grund av CORS-säkerhetsbegränsningar kan externa API:er (SCB, Riksbanken) inte anropas direkt från webbläsaren.
                    </p>
                    <p className="mt-2">
                      <strong>För riktig live data krävs:</strong> Backend API-proxy eller server-side data fetching.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="prose prose-sm text-gray-600">
              <ul>
                <li><strong>BNP-data:</strong> Baserat på Statistiska Centralbyrån (SCB), 
                    kvartalsvisa nationalräkenskaper för Sverige</li>
                <li><strong>Inflation:</strong> Baserat på Statistiska Centralbyrån (SCB), 
                    konsumentprisindex (KPI) för Sverige</li>
                <li><strong>Arbetslöshet:</strong> Baserat på Statistiska Centralbyrån (SCB), 
                    arbetskraftsundersökningen (AKU)</li>
                <li><strong>Bostadspriser:</strong> Baserat på Statistiska Centralbyrån (SCB), 
                    fastighetsprisindex för Sverige</li>
                <li><strong>Reporänta:</strong> Baserat på Sveriges Riksbank, 
                    penningpolitiska beslut (aktuell: 2,75%)</li>
                <li><strong>Valutakurser:</strong> Baserat på Sveriges Riksbank, 
                    dagliga valutakurser (SEK/EUR: ~11,58)</li>
                <li><strong>Uppdateringsfrekvens:</strong> Simulerad live data uppdateras var 30:e sekund, 
                    diagram uppdateras var 5:e minut med små variationer</li>
                <li><strong>Teknisk notering:</strong> För produktion behöver externa API-anrop göras 
                    via backend-server för att undvika CORS-problem</li>
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