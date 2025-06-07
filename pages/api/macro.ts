import type { NextApiRequest, NextApiResponse } from 'next'
import { getMacro } from '../../lib/macroSources'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data = await getMacro()
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600')
    res.setHeader('Content-Type', 'application/json')
    
    res.status(200).json(data)
  } catch (error) {
    console.error('API error in /api/macro:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const config = {
  api: {
    revalidate: 0
  }
} 