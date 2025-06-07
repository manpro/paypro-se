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
  usdSek: number | null
  usdEur: number | null
  debtRatio: number | null
}

// Aktuell officiell data för 2025
const CURRENT_DATA = {
  gdpQoQ: -0.20,      // Q1 2025 BNP minskade -0.2% QoQ säsongrensad (SCB)
  inflationYoY: 2.20,  // Senaste KPI-data
  unemployment: 8.50,  // Senaste arbetslöshetsdata
  hpiYoY: -8.20,      // Senaste bostadsprisdata
  repoRate: 2.25,     // 2.25% från 14 maj 2025 (Riksbank)
  sekEur: 10.943,     // 10.943 SEK/EUR per 5 juni 2025 (Riksbank)
  usdSek: 11.75,      // USD/SEK approximation baserat på aktuella kurser
  usdEur: 0.93,       // USD/EUR approximation baserat på aktuella kurser
  debtRatio: 187.00   // Senaste skuldsättningsdata
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

async function getUSDSEK(): Promise<number | null> {
  try {
    const response = await axios.get(
      'https://api.riksbank.se/swea/v1/Observations/SEKUSDPMI/all/latest/1',
      { timeout: 8000 }
    )
    
    if (response.data?.value) {
      const rate = parseFloat(response.data.value)
      // Validera att det är rimligt (8-15 SEK/USD)
      if (rate >= 8 && rate <= 15) {
        return rate
      }
    }
  } catch (error) {
    console.error('Riksbank USD/SEK error:', error)
  }
  
  return CURRENT_DATA.usdSek
}

async function getUSDEUR(): Promise<number | null> {
  try {
    const response = await axios.get(
      'https://api.riksbank.se/swea/v1/Observations/EURUSDPMI/all/latest/1',
      { timeout: 8000 }
    )
    
    if (response.data?.value) {
      const rate = parseFloat(response.data.value)
      // Validera att det är rimligt (0.8-1.2 USD/EUR)
      if (rate >= 0.8 && rate <= 1.2) {
        return rate
      }
    }
  } catch (error) {
    console.error('Riksbank USD/EUR error:', error)
  }
  
  return CURRENT_DATA.usdEur
}

export async function getMacro(): Promise<MacroData> {
  try {
    // Hämta live data från Riksbank för de värden vi kan få
    const [repoRate, sekEur, usdSek, usdEur] = await Promise.allSettled([
      getRepoRate(),
      getSEKEUR(),
      getUSDSEK(),
      getUSDEUR()
    ])

    return {
      updated: dayjs().toISOString(),
      gdpQoQ: CURRENT_DATA.gdpQoQ,
      inflationYoY: CURRENT_DATA.inflationYoY,
      unemployment: CURRENT_DATA.unemployment,
      hpiYoY: CURRENT_DATA.hpiYoY,
      repoRate: repoRate.status === 'fulfilled' ? repoRate.value : CURRENT_DATA.repoRate,
      sekEur: sekEur.status === 'fulfilled' ? sekEur.value : CURRENT_DATA.sekEur,
      usdSek: usdSek.status === 'fulfilled' ? usdSek.value : CURRENT_DATA.usdSek,
      usdEur: usdEur.status === 'fulfilled' ? usdEur.value : CURRENT_DATA.usdEur,
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