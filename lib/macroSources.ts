import axios from 'axios'
import dayjs from 'dayjs'

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

// Senaste kända data (Dec 2024/Jan 2025)
const CURRENT_DATA = {
  gdpQoQ: 0.3,       // Q3 2024 BNP-tillväxt
  inflationYoY: 2.2,  // Dec 2024 KPI
  unemployment: 8.5,  // Nov 2024 arbetslöshet
  hpiYoY: -8.2,      // Q3 2024 bostadspriser
  repoRate: 2.75,    // Dec 2024 Riksbank beslut
  sekEur: 11.58,     // Januari 2025 kurs
  debtRatio: 187     // Q2 2024 skuldsättning
}

async function getRepoRate(): Promise<number | null> {
  try {
    const response = await axios.get(
      'https://api.riksbank.se/swea/v1/Observations/SECBREPOEFF/all/latest/1',
      { timeout: 8000 }
    )
    
    if (response.data?.value) {
      return parseFloat(response.data.value)
    }
  } catch (error) {
    console.error('Riksbank repo rate error:', error)
  }
  
  return CURRENT_DATA.repoRate
}

async function getSEKEUR(): Promise<number | null> {
  try {
    const response = await axios.get(
      'https://api.riksbank.se/swea/v1/Observations/SEKEURPMI/all/latest/1',
      { timeout: 8000 }
    )
    
    if (response.data?.value) {
      return parseFloat(response.data.value)
    }
  } catch (error) {
    console.error('Riksbank SEK/EUR error:', error)
  }
  
  return CURRENT_DATA.sekEur
}

export async function getMacro(): Promise<MacroData> {
  try {
    // Försök hämta live data från Riksbank, använd aktuell data för SCB-värden
    const [repoRate, sekEur] = await Promise.allSettled([
      getRepoRate(),
      getSEKEUR()
    ])

    return {
      updated: dayjs().toISOString(),
      gdpQoQ: CURRENT_DATA.gdpQoQ,
      inflationYoY: CURRENT_DATA.inflationYoY,
      unemployment: CURRENT_DATA.unemployment,
      hpiYoY: CURRENT_DATA.hpiYoY,
      repoRate: repoRate.status === 'fulfilled' ? repoRate.value : CURRENT_DATA.repoRate,
      sekEur: sekEur.status === 'fulfilled' ? sekEur.value : CURRENT_DATA.sekEur,
      debtRatio: CURRENT_DATA.debtRatio
    }
  } catch (error) {
    console.error('Error in getMacro:', error)
    
    // Fallback till aktuell data
    return {
      updated: dayjs().toISOString(),
      ...CURRENT_DATA
    }
  }
} 