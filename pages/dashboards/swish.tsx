import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChartCard from '@/components/dashboards/ChartCard'
import MetricBox from '@/components/dashboards/MetricBox'
import { fetchPaymentData, fetchKeyMetrics, PaymentData, MetricData } from '@/lib/dataFetcher'

const SwishDashboard = () => {
  const [paymentData, setPaymentData] = useState<PaymentData[]>([])
  const [keyMetrics, setKeyMetrics] = useState<MetricData[]>([])
  const [loading, setLoading] = useState(true)

  // Mock monthly Swish growth data
  const swishGrowthData = [
    { month: 'Jan', transactions: 180 },
    { month: 'Feb', transactions: 185 },
    { month: 'Mar', transactions: 192 },
    { month: 'Apr', transactions: 198 },
    { month: 'Maj', transactions: 205 },
    { month: 'Jun', transactions: 210 },
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        const [payments, metrics] = await Promise.all([
          fetchPaymentData(),
          fetchKeyMetrics()
        ])
        setPaymentData(payments)
        setKeyMetrics(metrics.filter(m => m.title.includes('Swish'))) // Show Swish-related metrics
      } catch (error) {
        console.error('Error loading payment data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const swishMetrics: MetricData[] = [
    {
      title: 'Månadsvolym',
      value: '2.1',
      unit: 'Mdr trans.',
      change: '+8.5%',
      changeType: 'positive',
      description: 'Jämfört med förra året'
    },
    {
      title: 'Marknadsandel',
      value: '45',
      unit: '%',
      change: '+3.2%',
      changeType: 'positive',
      description: 'Av digitala betalningar'
    },
    {
      title: 'Genomsnitt/person',
      value: '127',
      unit: 'trans.',
      change: '+12%',
      changeType: 'positive',
      description: 'Per månad'
    }
  ]

  return (
    <>
      <Head>
        <title>Svenska Betalningar Dashboard - PayPro.se</title>
        <meta name="description" content="Analys av svenska betalningsmetoder och Swish-statistik." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="py-8 bg-gray-50 min-h-screen">
        <div className="container-custom">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Svenska Betalningar Dashboard</h1>
            <p className="text-lg text-gray-600">Swish och andra betalningsmetoder i Sverige</p>
          </div>

          {/* Swish Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {swishMetrics.map((metric, index) => (
              <MetricBox key={index} {...metric} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Methods Distribution */}
            <ChartCard
              title="Betalningsmetoder Marknadsandel"
              description="Fördelning av digitala betalningar i Sverige 2024"
            >
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-paypro-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                      labelStyle={{ color: '#374151' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Swish Growth Trend */}
            <ChartCard
              title="Swish Transaktioner per Månad"
              description="Miljoner transaktioner, 2024"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={swishGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} miljoner`, 'Transaktioner']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey="transactions" 
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Payment Methods Legend */}
          {!loading && (
            <div className="mt-8 card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Betalningsmetoder</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentData.map((method, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-3"
                      style={{ backgroundColor: method.color }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="mt-8 card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Viktiga Insikter</h3>
            <div className="prose prose-sm text-gray-600">
              <ul>
                <li><strong>Swish dominerar:</strong> Med 45% marknadsandel är Swish den populäraste digitala betalningsmetoden</li>
                <li><strong>Tillväxt fortsätter:</strong> Månatlig transaktionsvolym ökar med 8.5% jämfört med förra året</li>
                <li><strong>Kontanter minskar:</strong> Endast 8% av betalningar görs med kontanter, en fortsatt nedgång</li>
                <li><strong>Bankkort stabilt:</strong> Traditionella bankkort behåller 35% marknadsandel</li>
              </ul>
            </div>
          </div>

          {/* Data Sources */}
          <div className="mt-8 card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datakällor</h3>
            <div className="prose prose-sm text-gray-600">
              <ul>
                <li><strong>Swish-statistik:</strong> Getswish AB, månadsrapporter</li>
                <li><strong>Betalningsdata:</strong> Sveriges Riksbank, betalningsstatistik</li>
                <li><strong>Marknadsandel:</strong> Svensk Handel, betalningsrapport 2024</li>
                <li><strong>Uppdateringsfrekvens:</strong> Data uppdateras månadsvis</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default SwishDashboard 