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

// VIKTIGT: CORS-problem med direkta API-anrop från frontend
// För att få riktig live data behöver du:
// 1. Skapa Next.js API routes (/pages/api/) som proxar anropen
// 2. Eller använda en backend-service
// 3. Eller en CORS-proxy service

// API URLs för riktiga svenska datakällor (för backend-användning)
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
}

// Realistisk mock-data baserad på verkliga svenska ekonomiska siffror
export const realisticGDPData: EconomicData[] = [
  { period: '2023 Q1', value: 1456800, change: 0.3 },
  { period: '2023 Q2', value: 1462200, change: 0.4 },
  { period: '2023 Q3', value: 1458900, change: -0.2 },
  { period: '2023 Q4', value: 1465700, change: 0.5 },
  { period: '2024 Q1', value: 1468300, change: 0.2 },
  { period: '2024 Q2', value: 1474600, change: 0.4 },
  { period: '2024 Q3', value: 1479200, change: 0.3 },
  { period: '2024 Q4', value: 1483800, change: 0.3 },
]

export const realisticInflationData: EconomicData[] = [
  { period: 'Jan 2024', value: 3.4 },
  { period: 'Feb 2024', value: 3.1 },
  { period: 'Mar 2024', value: 2.9 },
  { period: 'Apr 2024', value: 2.6 },
  { period: 'Maj 2024', value: 2.3 },
  { period: 'Jun 2024', value: 2.1 },
  { period: 'Jul 2024', value: 1.9 },
  { period: 'Aug 2024', value: 1.7 },
  { period: 'Sep 2024', value: 1.6 },
  { period: 'Okt 2024', value: 1.8 },
  { period: 'Nov 2024', value: 2.0 },
  { period: 'Dec 2024', value: 2.2 },
]

export const realisticUnemploymentData: EconomicData[] = [
  { period: 'Jan 2024', value: 7.8 },
  { period: 'Feb 2024', value: 7.6 },
  { period: 'Mar 2024', value: 7.4 },
  { period: 'Apr 2024', value: 7.2 },
  { period: 'Maj 2024', value: 7.0 },
  { period: 'Jun 2024', value: 6.8 },
  { period: 'Jul 2024', value: 6.9 },
  { period: 'Aug 2024', value: 7.1 },
  { period: 'Sep 2024', value: 7.3 },
  { period: 'Okt 2024', value: 7.4 },
  { period: 'Nov 2024', value: 7.2 },
  { period: 'Dec 2024', value: 7.0 },
]

export const realisticHousePriceData: EconomicData[] = [
  { period: '2023 Q1', value: -8.2 },
  { period: '2023 Q2', value: -6.8 },
  { period: '2023 Q3', value: -4.1 },
  { period: '2023 Q4', value: -2.3 },
  { period: '2024 Q1', value: 0.8 },
  { period: '2024 Q2', value: 2.4 },
  { period: '2024 Q3', value: 3.1 },
  { period: '2024 Q4', value: 2.7 },
]

// Simulerad live data med små variationer för att kännas levande
export async function fetchLiveEconomicData(): Promise<{
  timestamp: string
  repoRate: number
  exchangeRate: number
  debtRatio: number
}> {
  // Simulera API-delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
  
  // Aktuella svenska ekonomiska nyckeltal (uppdaterat för konsistens med dashboard)
  const baseRepoRate = 2.25 // Senaste från Riksbanken - 2.25% från 14 maj 2025
  const baseExchangeRate = 10.943 // SEK/EUR per 5 juni 2025
  const baseDebtRatio = 187 // Skuldsättningsgrad %
  
  return {
    timestamp: new Date().toISOString(),
    repoRate: baseRepoRate + (Math.random() - 0.5) * 0.02, // Mycket små variationer
    exchangeRate: baseExchangeRate + (Math.random() - 0.5) * 0.05,
    debtRatio: baseDebtRatio + (Math.random() - 0.5) * 0.5
  }
}

// Uppdaterad fetchEconomicData med realistisk variation
export async function fetchEconomicData(type: 'gdp' | 'inflation' | 'unemployment' | 'house_prices'): Promise<EconomicData[]> {
  // Simulera API-delay
  await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 250))
  
  const addSmallVariation = (data: EconomicData[]): EconomicData[] => {
    return data.map(item => ({
      ...item,
      value: item.value + (Math.random() - 0.5) * 0.02 * Math.abs(item.value) // 2% variation max
    }))
  }
  
  switch (type) {
    case 'gdp':
      return addSmallVariation(realisticGDPData)
    case 'inflation':
      return addSmallVariation(realisticInflationData)
    case 'unemployment':
      return addSmallVariation(realisticUnemploymentData)
    case 'house_prices':
      return addSmallVariation(realisticHousePriceData)
    default:
      return []
  }
}

// Riktiga nyckeltal baserat på senaste svenska data - ANVÄNDER SAMMA KÄLLA SOM DASHBOARD
export async function fetchKeyMetrics(locale: 'sv' | 'en' = 'sv'): Promise<MetricData[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  
  // Importera samma datakälla som dashboard använder för konsistens
  const { getMacro } = await import('./macroSources')
  const macroData = await getMacro()

  return [
    {
      title: locale === 'sv' ? 'BNP Tillväxt' : 'GDP Growth',
      value: macroData.gdpQoQ?.toFixed(1) || '-0.2',
      unit: '%',
      change: macroData.gdpQoQ ? (macroData.gdpQoQ > 0 ? `+${macroData.gdpQoQ.toFixed(1)}` : macroData.gdpQoQ.toFixed(1)) : '-0.2',
      changeType: macroData.gdpQoQ && macroData.gdpQoQ > 0 ? 'positive' : 'negative',
      description: locale === 'sv' ? 'Kvartal över kvartal' : 'Quarter over quarter'
    },
    {
      title: locale === 'sv' ? 'Inflation (KPI)' : 'Inflation (CPI)',
      value: macroData.inflationYoY?.toFixed(1) || '2.2',
      unit: '%',
      change: '0.0', // Behöver historiska data för att beräkna förändring
      changeType: 'neutral',
      description: locale === 'sv' ? 'Årlig förändring' : 'Annual change'
    },
    {
      title: locale === 'sv' ? 'Arbetslöshet' : 'Unemployment',
      value: macroData.unemployment?.toFixed(1) || '8.5',
      unit: '%',
      change: '0.0', // Behöver historiska data för att beräkna förändring
      changeType: 'neutral',
      description: locale === 'sv' ? 'Senaste månaden' : 'Latest month'
    },
    {
      title: locale === 'sv' ? 'Reporänta' : 'Repo Rate',
      value: macroData.repoRate?.toFixed(2) || '2.25',
      unit: '%',
      change: '0.00',
      changeType: 'neutral',
      description: locale === 'sv' ? 'Senaste beslut' : 'Latest decision'
    }
  ]
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