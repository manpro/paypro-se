// Data types
export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  readingTime: string
}

export interface EconomicData {
  period: string
  value: number
  change?: number
}

export interface PaymentData {
  name: string
  value: number
  color: string
}

export interface MetricData {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  unit?: string
  description?: string
}

// API URLs för riktiga svenska datakällor
const API_ENDPOINTS = {
  // SCB (Statistiska Centralbyrån) - Officiell svensk statistik
  SCB_BASE: 'https://api.scb.se/OV0104/v1/doris/sv/ssd',
  SCB_GDP: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/NR/NR0103/NR0103B/NR0103ENS2010T03Ar',
  SCB_INFLATION: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101A/PR0101A2',
  SCB_UNEMPLOYMENT: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0401/AM0401A/AM0401D',
  SCB_HOUSE_PRICES: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BO/BO0501/BO0501A/BO0501T04',
  
  // Sveriges Riksbank - Officiella räntor och valutakurser
  RIKSBANK_BASE: 'https://api.riksbank.se/swea/v1',
  RIKSBANK_REPO_RATE: 'https://api.riksbank.se/swea/v1/Observations/REPORATE/M',
  RIKSBANK_EXCHANGE: 'https://api.riksbank.se/swea/v1/Observations/SEKEURPMI/D',
  
  // Ekonomifakta för skuldsättningsgrad
  DEBT_RATIO: 'https://www.ekonomifakta.se/api/hushallens-skuldsattning'
}

// Riktig data från SCB API
export async function fetchRealGDPData(): Promise<EconomicData[]> {
  try {
    const query = {
      "query": [
        {
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": ["NR0103ENS2010T03.M.S1.S.4.N._T.B1GQ._T.C._T.L._T"]
          }
        }
      ],
      "response": {
        "format": "json"
      }
    }

    const response = await fetch(API_ENDPOINTS.SCB_GDP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query)
    })

    if (!response.ok) {
      throw new Error(`SCB API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform SCB data to our format
    return data.data?.map((item: any, index: number) => ({
      period: `${item.key[1]} Q${Math.floor(index/3) + 1}`,
      value: parseFloat(item.values[0]) || 0,
      change: index > 0 ? ((parseFloat(item.values[0]) / data.data[index-1].values[0] - 1) * 100) : 0
    })).slice(-8) || [] // Last 8 quarters
  } catch (error) {
    console.error('Error fetching real GDP data:', error)
    return []
  }
}

// Riktig inflation från SCB
export async function fetchRealInflationData(): Promise<EconomicData[]> {
  try {
    const query = {
      "query": [
        {
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": ["000000CX"]
          }
        }
      ],
      "response": {
        "format": "json"
      }
    }

    const response = await fetch(API_ENDPOINTS.SCB_INFLATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query)
    })

    const data = await response.json()
    
    return data.data?.map((item: any) => ({
      period: item.key[1], // Period from SCB
      value: parseFloat(item.values[0]) || 0
    })).slice(-12) || [] // Last 12 months
  } catch (error) {
    console.error('Error fetching real inflation data:', error)
    return []
  }
}

// Riktig arbetslöshet från SCB
export async function fetchRealUnemploymentData(): Promise<EconomicData[]> {
  try {
    const query = {
      "query": [
        {
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": ["000000L4"]
          }
        }
      ],
      "response": {
        "format": "json"
      }
    }

    const response = await fetch(API_ENDPOINTS.SCB_UNEMPLOYMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query)
    })

    const data = await response.json()
    
    return data.data?.map((item: any) => ({
      period: item.key[1],
      value: parseFloat(item.values[0]) || 0
    })).slice(-12) || []
  } catch (error) {
    console.error('Error fetching real unemployment data:', error)
    return []
  }
}

// Riktiga bostadspriser från SCB
export async function fetchRealHousePriceData(): Promise<EconomicData[]> {
  try {
    const query = {
      "query": [
        {
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": ["000000W9"]
          }
        }
      ],
      "response": {
        "format": "json"
      }
    }

    const response = await fetch(API_ENDPOINTS.SCB_HOUSE_PRICES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query)
    })

    const data = await response.json()
    
    return data.data?.map((item: any, index: number) => ({
      period: item.key[1],
      value: index > 0 ? ((parseFloat(item.values[0]) / data.data[index-1].values[0] - 1) * 100) : 0
    })).slice(-8) || []
  } catch (error) {
    console.error('Error fetching real house price data:', error)
    return []
  }
}

// Riktig live data från Riksbanken
export async function fetchLiveEconomicData(): Promise<{
  timestamp: string
  repoRate: number
  exchangeRate: number
  debtRatio: number
}> {
  try {
    // Hämta reporänta från Riksbanken
    const repoResponse = await fetch(`${API_ENDPOINTS.RIKSBANK_REPO_RATE}?$top=1&$orderby=date desc`)
    const repoData = await repoResponse.json()
    const repoRate = repoData.value?.[0]?.value || 4.00

    // Hämta valutakurs SEK/EUR från Riksbanken
    const exchangeResponse = await fetch(`${API_ENDPOINTS.RIKSBANK_EXCHANGE}?$top=1&$orderby=date desc`)
    const exchangeData = await exchangeResponse.json()
    const exchangeRate = exchangeData.value?.[0]?.value || 11.42

    // Skuldsättningsgrad - kan komma från flera källor, här använder vi SCB:s senaste data
    const debtResponse = await fetch('https://api.scb.se/OV0104/v1/doris/sv/ssd/START/FM/FM0201/FM0201B/HushallSkuld')
    const debtData = await debtResponse.json()
    const debtRatio = debtData.data?.[0]?.values?.[0] || 185

    return {
      timestamp: new Date().toISOString(),
      repoRate: parseFloat(repoRate.toString()),
      exchangeRate: parseFloat(exchangeRate.toString()),
      debtRatio: parseFloat(debtRatio.toString())
    }
  } catch (error) {
    console.error('Error fetching live economic data:', error)
    // Fallback till senast kända värden om API:et är nere
    return {
      timestamp: new Date().toISOString(),
      repoRate: 4.00,
      exchangeRate: 11.42,
      debtRatio: 185
    }
  }
}

// Uppdaterad fetchEconomicData för att använda riktiga API:er
export async function fetchEconomicData(type: 'gdp' | 'inflation' | 'unemployment' | 'house_prices'): Promise<EconomicData[]> {
  try {
    switch (type) {
      case 'gdp':
        return await fetchRealGDPData()
      case 'inflation':
        return await fetchRealInflationData()
      case 'unemployment':
        return await fetchRealUnemploymentData()
      case 'house_prices':
        return await fetchRealHousePriceData()
      default:
        return []
    }
  } catch (error) {
    console.error(`Error fetching ${type} data:`, error)
    return []
  }
}

// Riktiga nyckeltal från de senaste API-anropen
export async function fetchKeyMetrics(): Promise<MetricData[]> {
  try {
    const liveData = await fetchLiveEconomicData()
    const gdpData = await fetchRealGDPData()
    const inflationData = await fetchRealInflationData()
    const unemploymentData = await fetchRealUnemploymentData()

    const latestGdp = gdpData[gdpData.length - 1]
    const gdpChange = latestGdp?.change || 0

    return [
      {
        title: 'BNP Tillväxt',
        value: gdpChange.toFixed(1),
        unit: '%',
        change: gdpChange > 0 ? `+${gdpChange.toFixed(1)}` : gdpChange.toFixed(1),
        changeType: gdpChange > 0 ? 'positive' : 'negative',
        description: 'Kvartal över kvartal'
      },
      {
        title: 'Inflation (KPI)',
        value: inflationData[inflationData.length - 1]?.value?.toFixed(1) || '0.0',
        unit: '%',
        change: inflationData.length > 1 ? (inflationData[inflationData.length - 1]?.value - inflationData[inflationData.length - 2]?.value)?.toFixed(1) : '0.0',
        changeType: inflationData.length > 1 && (inflationData[inflationData.length - 1]?.value - inflationData[inflationData.length - 2]?.value) < 0 ? 'positive' : 'negative',
        description: 'Årlig förändring'
      },
      {
        title: 'Arbetslöshet',
        value: unemploymentData[unemploymentData.length - 1]?.value?.toFixed(1) || '0.0',
        unit: '%',
        change: unemploymentData.length > 1 ? (unemploymentData[unemploymentData.length - 1]?.value - unemploymentData[unemploymentData.length - 2]?.value)?.toFixed(1) : '0.0',
        changeType: unemploymentData.length > 1 && (unemploymentData[unemploymentData.length - 1]?.value - unemploymentData[unemploymentData.length - 2]?.value) < 0 ? 'positive' : 'negative',
        description: 'Senaste månaden'
      },
      {
        title: 'Reporänta',
        value: liveData.repoRate.toFixed(2),
        unit: '%',
        change: '0.00',
        changeType: 'neutral',
        description: 'Senaste beslut'
      }
    ]
  } catch (error) {
    console.error('Error fetching key metrics:', error)
    return []
  }
}

// Behåll dessa för andra delar av appen
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return [
    {
      slug: 'robinhood-bitstamp-acquisition-analysis',
      title: 'Robinhood\'s Strategic Acquisition of Bitstamp: Implications for Cryptocurrency Regulation and European Expansion',
      date: '2025-01-06',
      excerpt: 'In-depth analysis of Robinhood\'s acquisition of Bitstamp and its impact on cryptocurrency markets, regulation, and institutional adoption in Europe.',
      content: '',
      tags: ['cryptocurrency', 'robinhood', 'bitstamp', 'regulation', 'europe'],
      readingTime: '8-10 min'
    },
    {
      slug: 'sveriges-betalningslandskap-2024',
      title: 'Sveriges betalningslandskap 2024: Swish dominerar allt mer',
      date: '2024-12-20',
      excerpt: 'En djupanalys av hur svenskorna betalar idag och vad som väntar framöver.',
      content: '',
      tags: ['betalningar', 'swish', 'sverige'],
      readingTime: '5 min'
    },
    {
      slug: 'riksbankens-rentebeslut-december',
      title: 'Riksbankens räntebeslut: Vad betyder det för ekonomin?',
      date: '2024-12-18',
      excerpt: 'Analys av Riksbankens senaste räntebeslut och dess effekter på svensk ekonomi.',
      content: '',
      tags: ['räntor', 'riksbanken', 'ekonomi'],
      readingTime: '4 min'
    },
    {
      slug: 'globala-betaltrender-2024',
      title: 'Globala betaltrender som formar framtiden',
      date: '2024-12-15',
      excerpt: 'Från kryptovalutor till CBDC - vilka betalningsteknologier kommer att dominera?',
      content: '',
      tags: ['fintech', 'globalt', 'framtid'],
      readingTime: '6 min'
    }
  ]
}

export async function fetchPaymentData(): Promise<PaymentData[]> {
  return [
    { name: 'Swish', value: 45, color: '#0ea5e9' },
    { name: 'Bankkort', value: 35, color: '#8b5cf6' },
    { name: 'Kontanter', value: 8, color: '#f59e0b' },
    { name: 'Övrigt', value: 12, color: '#6b7280' },
  ]
} 