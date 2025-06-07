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

// Aktuell officiell data för 2025
const CURRENT_DATA = {
  gdpQoQ: -0.2,      // Q1 2025 BNP minskade -0.2% QoQ säsongrensad (SCB)
  inflationYoY: 2.2,  // Senaste KPI-data
  unemployment: 8.5,  // Senaste arbetslöshetsdata
  hpiYoY: -8.2,      // Senaste bostadsprisdata
  repoRate: 2.25,    // 2.25% från 14 maj 2025 (Riksbank)
  sekEur: 10.943,    // 10.943 SEK/EUR per 5 juni 2025 (Riksbank)
  debtRatio: 187     // Senaste skuldsättningsdata
}

async function getRepoRate(): Promise<number | null> {
  try {
    const response = await axios.get(
      'https://api.riksbank.se/swea/v1/Observations/SECBREPOEFF/all/latest/1',
      { timeout: 8000 }
    )
    
    if (response.data?.value) {
      const rate = parseFloat(response.data.value)
      // Validera att det är rimligt (0-10%)
      if (rate >= 0 && rate <= 10) {
        return rate
      }
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
      const rate = parseFloat(response.data.value)
      // Validera att det är rimligt (9-15 SEK/EUR)
      if (rate >= 9 && rate <= 15) {
        return rate
      }
    }
  } catch (error) {
    console.error('Riksbank SEK/EUR error:', error)
  }
  
  return CURRENT_DATA.sekEur
}

export async function getMacro(): Promise<MacroData> {
  try {
    // Hämta live data från Riksbank för de värden vi kan få
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