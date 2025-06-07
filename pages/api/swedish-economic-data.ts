import type { NextApiRequest, NextApiResponse } from 'next'

// API route för att hämta svenska ekonomiska data (löser CORS-problem)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type } = req.query

  try {
    let data: any = null

    switch (type) {
      case 'gdp':
        data = await fetchSCBData('GDP')
        break
      case 'inflation':
        data = await fetchSCBData('INFLATION')
        break
      case 'unemployment':
        data = await fetchSCBData('UNEMPLOYMENT')
        break
      case 'house_prices':
        data = await fetchSCBData('HOUSE_PRICES')
        break
      case 'repo_rate':
        data = await fetchRiksbankData('REPO_RATE')
        break
      case 'exchange_rate':
        data = await fetchRiksbankData('EXCHANGE_RATE')
        break
      default:
        return res.status(400).json({ error: 'Invalid data type' })
    }

    // Cache headers för bättre prestanda
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    res.status(200).json({ data, timestamp: new Date().toISOString() })

  } catch (error) {
    console.error(`Error fetching ${type} data:`, error)
    res.status(500).json({ 
      error: 'Failed to fetch data', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}

// Hämta data från SCB API
async function fetchSCBData(indicator: string) {
  const endpoints = {
    GDP: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/NR/NR0103/NR0103B/NR0103ENS2010T03Ar',
    INFLATION: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/PR/PR0101/PR0101A/PR0101A2',
    UNEMPLOYMENT: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0401/AM0401A/AM0401D',
    HOUSE_PRICES: 'https://api.scb.se/OV0104/v1/doris/sv/ssd/START/BO/BO0501/BO0501A/BO0501T04'
  }

  const queries = {
    GDP: {
      "query": [
        {
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": ["NR0103ENS2010T03.M.S1.S.4.N._T.B1GQ._T.C._T.L._T"]
          }
        }
      ],
      "response": { "format": "json" }
    },
    INFLATION: {
      "query": [
        {
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": ["000000CX"]
          }
        }
      ],
      "response": { "format": "json" }
    },
    UNEMPLOYMENT: {
      "query": [
        {
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": ["000000L4"]
          }
        }
      ],
      "response": { "format": "json" }
    },
    HOUSE_PRICES: {
      "query": [
        {
          "code": "ContentsCode",
          "selection": {
            "filter": "item",
            "values": ["000000W9"]
          }
        }
      ],
      "response": { "format": "json" }
    }
  }

  const endpoint = endpoints[indicator as keyof typeof endpoints]
  const query = queries[indicator as keyof typeof queries]

  if (!endpoint || !query) {
    throw new Error(`Unknown indicator: ${indicator}`)
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'PayPro-Sweden-Dashboard/1.0'
    },
    body: JSON.stringify(query)
  })

  if (!response.ok) {
    throw new Error(`SCB API error: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

// Hämta data från Riksbankens API
async function fetchRiksbankData(indicator: string) {
  const endpoints = {
    REPO_RATE: 'https://api.riksbank.se/swea/v1/Observations/REPORATE/M?$top=1&$orderby=date desc',
    EXCHANGE_RATE: 'https://api.riksbank.se/swea/v1/Observations/SEKEURPMI/D?$top=1&$orderby=date desc'
  }

  const endpoint = endpoints[indicator as keyof typeof endpoints]

  if (!endpoint) {
    throw new Error(`Unknown indicator: ${indicator}`)
  }

  const response = await fetch(endpoint, {
    headers: {
      'User-Agent': 'PayPro-Sweden-Dashboard/1.0',
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Riksbank API error: ${response.status} ${response.statusText}`)
  }

  return await response.json()
} 