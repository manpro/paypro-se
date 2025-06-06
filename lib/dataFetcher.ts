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

// Mock data for development
export const mockEconomicData: EconomicData[] = [
  { period: '2023 Q1', value: 545000, change: 2.1 },
  { period: '2023 Q2', value: 551000, change: 1.8 },
  { period: '2023 Q3', value: 547000, change: -0.7 },
  { period: '2023 Q4', value: 553000, change: 1.1 },
  { period: '2024 Q1', value: 558000, change: 0.9 },
]

export const mockInflationData: EconomicData[] = [
  { period: 'Jan 2024', value: 3.2 },
  { period: 'Feb 2024', value: 3.0 },
  { period: 'Mar 2024', value: 2.8 },
  { period: 'Apr 2024', value: 2.6 },
  { period: 'Maj 2024', value: 2.4 },
  { period: 'Jun 2024', value: 2.2 },
]

export const mockPaymentData: PaymentData[] = [
  { name: 'Swish', value: 45, color: '#0ea5e9' },
  { name: 'Bankkort', value: 35, color: '#8b5cf6' },
  { name: 'Kontanter', value: 8, color: '#f59e0b' },
  { name: 'Övrigt', value: 12, color: '#6b7280' },
]

export const mockKeyMetrics: MetricData[] = [
  {
    title: 'BNP Tillväxt',
    value: '0.9',
    unit: '%',
    change: '+0.2',
    changeType: 'positive',
    description: 'Kvartal över kvartal'
  },
  {
    title: 'Inflation (KPI)',
    value: '2.2',
    unit: '%',
    change: '-0.2',
    changeType: 'positive',
    description: 'Årlig förändring'
  },
  {
    title: 'Reporänta',
    value: '4.00',
    unit: '%',
    change: '0.00',
    changeType: 'neutral',
    description: 'Senaste beslut'
  },
  {
    title: 'Swish Transaktioner',
    value: '2.1',
    unit: 'Mdr',
    change: '+8.5',
    changeType: 'positive',
    description: 'Per månad'
  }
]

// Data fetching functions
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  // In a real app, this would fetch from an API or read MDX files
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
      excerpt: 'En djupanalys av hur svenskarna betalar idag och vad som väntar framöver.',
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

export async function fetchEconomicData(type: 'gdp' | 'inflation' | 'interest'): Promise<EconomicData[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100))
  
  switch (type) {
    case 'gdp':
      return mockEconomicData
    case 'inflation':
      return mockInflationData
    default:
      return []
  }
}

export async function fetchPaymentData(): Promise<PaymentData[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockPaymentData
}

export async function fetchKeyMetrics(): Promise<MetricData[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return mockKeyMetrics
} 