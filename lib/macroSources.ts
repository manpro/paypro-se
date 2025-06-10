import axios from 'axios'
import dayjs from 'dayjs'

export interface MacroData {
  updated: string
  gdpQoQ: number | null
  inflationYoY: number | null
  unemployment: number | null
  ecbRate: number | null      // NY: ECB deposit facility rate
  repoRate: number | null
  sekEur: number | null
  usdSek: number | null
  usdEur: number | null
}

// FALLBACK DATA - Används endast om API:er inte fungerar
const CURRENT_DATA = {
  gdpQoQ: -0.20,      // Q1 2025 BNP MINSKADE -0.2% QoQ säsongrensad (SCB)
  inflationYoY: 2.30, // KPI maj 2025: +2.3% årlig förändring (SCB)  
  unemployment: 8.70, // AKU säsongrensad Q1 2025: 8.7% (SCB)
  ecbRate: 2.00,      // ECB deposit facility rate (ECB API)
  repoRate: 2.25,     // Riksbank fallback
  sekEur: 10.946,     // Riksbank fallback
  usdSek: 9.60,       // Riksbank fallback
  usdEur: 0.88,       // Riksbank fallback
}

// SCB API-funktioner för live data
async function fetchScbGdp(): Promise<number | null> {
  try {
    const response = await axios.get(
      'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/NR/NR0103/NR0103B/NR0103ENS2010T03Kv',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: {
          query: [
            { code: "ContentsCode", selection: { filter: "item", values: ["NR0103G9"] }},
            { code: "Tid", selection: { filter: "top", values: 1 }}
          ],
          response: { format: "json" }
        },
        timeout: 8000
      }
    )
    
    if (response.data?.data?.[0]?.values?.[0]) {
      return parseFloat(response.data.data[0].values[0])
    }
    return null
  } catch (error) {
    console.log('SCB GDP API fel, använder fallback:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

async function fetchScbInflation(): Promise<number | null> {
  try {
    const response = await axios.get(
      'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101A/KPIFastM2',
      {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        data: {
          query: [
            { code: "ContentsCode", selection: { filter: "item", values: ["0000073T"] }},
            { code: "Tid", selection: { filter: "top", values: 1 }}
          ],
          response: { format: "json" }
        },
        timeout: 8000
      }
    )
    
    if (response.data?.data?.[0]?.values?.[0]) {
      return parseFloat(response.data.data[0].values[0])
    }
    return null
  } catch (error) {
    console.log('SCB Inflation API fel, använder fallback:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

async function fetchScbUnemployment(): Promise<number | null> {
  try {
    const response = await axios.get(
      'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0401/AM0401A/ArbStatusM',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: {
          query: [
            { code: "Arbetskraftstatus", selection: { filter: "item", values: ["3"] }},
            { code: "ContentsCode", selection: { filter: "item", values: ["AM0401B9"] }},
            { code: "Tid", selection: { filter: "top", values: 1 }}
          ],
          response: { format: "json" }
        },
        timeout: 8000
      }
    )
    
    if (response.data?.data?.[0]?.values?.[0]) {
      return parseFloat(response.data.data[0].values[0])
    }
    return null
  } catch (error) {
    console.log('SCB Unemployment API fel, använder fallback:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

// ECB API-funktion för deposit facility rate
async function fetchEcbRate(): Promise<number | null> {
  try {
    const response = await axios.get(
      'https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.4F.KR.DFR.LEV?format=csvdata&lastNObservations=1',
      { 
        timeout: 8000,
        headers: {
          'Accept': 'text/csv',
          'User-Agent': 'PayPro.se/1.0'
        }
      }
    )
    
    if (response.data) {
      const lines = response.data.trim().split('\n')
      if (lines.length >= 2) {
        const dataLine = lines[lines.length - 1] // Sista raden
        const columns = dataLine.split(',')
        if (columns.length >= 2) {
          const rate = parseFloat(columns[columns.length - 1]) // Sista kolumnen
          if (!isNaN(rate) && rate >= 0 && rate <= 10) {
            return rate
          }
        }
      }
    }
    return null
  } catch (error) {
    console.log('ECB Rate API fel, använder fallback:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

// Riksbank API-funktioner (oförändrade)
async function fetchRiksbankData(seriesId: string): Promise<number | null> {
  try {
    const response = await axios.get(
      `https://api.riksbank.se/swea/v1/Observations/${seriesId}/1`,
      { timeout: 8000 }
    )
    
    if (response.data?.length > 0) {
      const latestData = response.data[0]
      const value = parseFloat(latestData.value)
      
      if (!isNaN(value)) {
        // Validering per datakälla
        if (seriesId === 'SECBREPOEFF' && (value < 0 || value > 10)) return null
        if (seriesId === 'SEKEURPMI' && (value < 8 || value > 15)) return null  
        if (seriesId === 'SEKUSDPMI' && (value < 9 || value > 11)) return null
        if (seriesId === 'EURUSDPMI' && (value < 0.7 || value > 1.2)) return null
        
        return value
      }
    }
    return null
  } catch (error) {
    console.log(`Riksbank API fel för ${seriesId}, använder fallback:`, error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

// Huvudfunktion som hämtar all live data
export async function getMacro(): Promise<MacroData> {
  console.log('🔄 Hämtar live ekonomisk data...')
  
  try {
    // Kör alla API-anrop parallellt för bättre prestanda
    const [
      gdpData,
      inflationData, 
      unemploymentData,
      ecbRateData,
      repoRateData,
      sekEurData,
      usdSekData,
      usdEurData
    ] = await Promise.all([
      fetchScbGdp(),
      fetchScbInflation(),
      fetchScbUnemployment(), 
      fetchEcbRate(),                    // NY: ECB rate
      fetchRiksbankData('SECBREPOEFF'),
      fetchRiksbankData('SEKEURPMI'),
      fetchRiksbankData('SEKUSDPMI'),
      fetchRiksbankData('EURUSDPMI')
    ])

    const result: MacroData = {
      updated: dayjs().toISOString(),
      gdpQoQ: gdpData ?? CURRENT_DATA.gdpQoQ,
      inflationYoY: inflationData ?? CURRENT_DATA.inflationYoY,
      unemployment: unemploymentData ?? CURRENT_DATA.unemployment,
      ecbRate: ecbRateData ?? CURRENT_DATA.ecbRate,        // NY: ECB rate
      repoRate: repoRateData ?? CURRENT_DATA.repoRate,
      sekEur: sekEurData ?? CURRENT_DATA.sekEur,
      usdSek: usdSekData ?? CURRENT_DATA.usdSek,
      usdEur: usdEurData ?? CURRENT_DATA.usdEur,
    }

    // Logga vilka data som kommer från API vs fallback
    const apiSources = []
    const fallbackSources = []
    
    if (gdpData !== null) apiSources.push('BNP(SCB)')
    else fallbackSources.push('BNP')
    
    if (inflationData !== null) apiSources.push('Inflation(SCB)')
    else fallbackSources.push('Inflation')
    
    if (unemploymentData !== null) apiSources.push('Arbetslöshet(SCB)')
    else fallbackSources.push('Arbetslöshet')
    
    if (ecbRateData !== null) apiSources.push('ECB-ränta(ECB)')  // NY
    else fallbackSources.push('ECB-ränta')
    
    if (repoRateData !== null) apiSources.push('Reporänta(RB)')
    else fallbackSources.push('Reporänta')
    
    if (sekEurData !== null) apiSources.push('SEK/EUR(RB)')
    else fallbackSources.push('SEK/EUR')
    
    if (usdSekData !== null) apiSources.push('USD/SEK(RB)')
    else fallbackSources.push('USD/SEK')
    
    if (usdEurData !== null) apiSources.push('USD/EUR(RB)')
    else fallbackSources.push('USD/EUR')

    console.log('✅ Live API-data:', apiSources.join(', '))
    if (fallbackSources.length > 0) {
      console.log('⚠️ Fallback-data:', fallbackSources.join(', '))
    }

    return result

  } catch (error) {
    console.error('❌ Fel vid hämtning av makrodata:', error)
    
    // Returnera fallback-data om allt annat misslyckas
    return {
      updated: dayjs().toISOString(),
      gdpQoQ: CURRENT_DATA.gdpQoQ,
      inflationYoY: CURRENT_DATA.inflationYoY,
      unemployment: CURRENT_DATA.unemployment,
      ecbRate: CURRENT_DATA.ecbRate,        // NY: ECB rate fallback
      repoRate: CURRENT_DATA.repoRate,
      sekEur: CURRENT_DATA.sekEur,
      usdSek: CURRENT_DATA.usdSek,
      usdEur: CURRENT_DATA.usdEur,
    }
  }
} 