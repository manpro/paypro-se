import axios from 'axios'
import dayjs from 'dayjs'
import { withCache } from './cache'

export interface MacroData {
  updated: string
  gdpQoQ: number | null
  inflationYoY: number | null
  unemployment: number | null
  hpiYoY: number | null
  repoRate: number | null
  sekEur: number | null
  debtRatio: number | null
}

const SCB_BASE = 'https://api.scb.se/OV0104/v1/doris/en/ssd'
const RIKSBANK_BASE = 'https://api.riksbank.se/v1/FinancialStatistics/series'

async function fetchSCBData(path: string, query: any): Promise<any> {
  try {
    const response = await axios.post(`${SCB_BASE}/${path}`, {
      query,
      response: { format: 'JSON' }
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PayPro-Sweden-Dashboard/1.0'
      }
    })
    return response.data
  } catch (error) {
    console.error(`SCB API error for ${path}:`, error)
    return null
  }
}

async function fetchRiksbankData(seriesId: string): Promise<any> {
  try {
    const response = await axios.get(`${RIKSBANK_BASE}/${seriesId}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'PayPro-Sweden-Dashboard/1.0'
      }
    })
    return response.data
  } catch (error) {
    console.error(`Riksbank API error for ${seriesId}:`, error)
    return null
  }
}

async function getGDP(): Promise<number | null> {
  return withCache('gdp', 24 * 60 * 60, async () => {
    const data = await fetchSCBData('NR/NR0103/NR0103S/NR0103ENS10', [
      {
        code: 'ContentsCode',
        selection: {
          filter: 'item',
          values: ['BNP_CONST']
        }
      }
    ])
    
    if (!data?.data || data.data.length < 2) return null
    
    const latest = parseFloat(data.data[data.data.length - 1].values[0])
    const previous = parseFloat(data.data[data.data.length - 2].values[0])
    
    return ((latest - previous) / previous) * 100
  })
}

async function getInflation(): Promise<number | null> {
  return withCache('inflation', 24 * 60 * 60, async () => {
    const data = await fetchSCBData('PR/PR0101/PR0101N', [
      {
        code: 'ContentsCode',
        selection: {
          filter: 'item',
          values: ['000000CX']
        }
      }
    ])
    
    if (!data?.data || data.data.length < 12) return null
    
    const latest = parseFloat(data.data[data.data.length - 1].values[0])
    const yearAgo = parseFloat(data.data[data.data.length - 13].values[0])
    
    return ((latest - yearAgo) / yearAgo) * 100
  })
}

async function getUnemployment(): Promise<number | null> {
  return withCache('unemployment', 24 * 60 * 60, async () => {
    const data = await fetchSCBData('AM/AM0401/AM0401N0', [
      {
        code: 'ContentsCode',
        selection: {
          filter: 'item',
          values: ['000000L4']
        }
      }
    ])
    
    if (!data?.data || data.data.length === 0) return null
    
    return parseFloat(data.data[data.data.length - 1].values[0])
  })
}

async function getHPI(): Promise<number | null> {
  return withCache('hpi', 24 * 60 * 60, async () => {
    const data = await fetchSCBData('BO/BO0501/BO0501A', [
      {
        code: 'ContentsCode',
        selection: {
          filter: 'item',
          values: ['000000W9']
        }
      }
    ])
    
    if (!data?.data || data.data.length < 12) return null
    
    const latest = parseFloat(data.data[data.data.length - 1].values[0])
    const yearAgo = parseFloat(data.data[data.data.length - 13].values[0])
    
    return ((latest - yearAgo) / yearAgo) * 100
  })
}

async function getRepoRate(): Promise<number | null> {
  return withCache('repo_rate', 24 * 60 * 60, async () => {
    const data = await fetchRiksbankData('SECBREPOEFF')
    
    if (!data?.observations || data.observations.length === 0) return null
    
    return parseFloat(data.observations[data.observations.length - 1].value)
  })
}

async function getSEKEUR(): Promise<number | null> {
  return withCache('sek_eur', 6 * 60 * 60, async () => {
    const data = await fetchRiksbankData('SEKEURPMI')
    
    if (!data?.observations || data.observations.length === 0) return null
    
    return parseFloat(data.observations[data.observations.length - 1].value)
  })
}

async function getDebtRatio(): Promise<number | null> {
  return withCache('debt_ratio', 24 * 60 * 60, async () => {
    const data = await fetchSCBData('NR/SektorENS2010KvKeyIn', [
      {
        code: 'ContentsCode',
        selection: {
          filter: 'item',
          values: ['DHH_DEBT_RATIO']
        }
      }
    ])
    
    if (!data?.data || data.data.length === 0) return null
    
    return parseFloat(data.data[data.data.length - 1].values[0])
  })
}

export async function getMacro(): Promise<MacroData> {
  try {
    const [gdpQoQ, inflationYoY, unemployment, hpiYoY, repoRate, sekEur, debtRatio] = await Promise.allSettled([
      getGDP(),
      getInflation(),
      getUnemployment(),
      getHPI(),
      getRepoRate(),
      getSEKEUR(),
      getDebtRatio()
    ])

    return {
      updated: dayjs().toISOString(),
      gdpQoQ: gdpQoQ.status === 'fulfilled' ? gdpQoQ.value : null,
      inflationYoY: inflationYoY.status === 'fulfilled' ? inflationYoY.value : null,
      unemployment: unemployment.status === 'fulfilled' ? unemployment.value : null,
      hpiYoY: hpiYoY.status === 'fulfilled' ? hpiYoY.value : null,
      repoRate: repoRate.status === 'fulfilled' ? repoRate.value : null,
      sekEur: sekEur.status === 'fulfilled' ? sekEur.value : null,
      debtRatio: debtRatio.status === 'fulfilled' ? debtRatio.value : null
    }
  } catch (error) {
    console.error('Error in getMacro:', error)
    
    // Return cached values on error
    const cached = await withCache('macro_fallback', 0, async () => null)
    if (cached) return cached
    
    // Ultimate fallback
    return {
      updated: dayjs().toISOString(),
      gdpQoQ: null,
      inflationYoY: null,
      unemployment: null,
      hpiYoY: null,
      repoRate: null,
      sekEur: null,
      debtRatio: null
    }
  }
} 