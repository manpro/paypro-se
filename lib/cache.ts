import Redis from 'ioredis'

let redis: Redis | null = null

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('Redis credentials not found, caching disabled')
    return null
  }

  if (!redis) {
    redis = new Redis(process.env.UPSTASH_REDIS_REST_URL, {
      password: process.env.UPSTASH_REDIS_REST_TOKEN,
      enableReadyCheck: false,
      lazyConnect: true,
      maxRetriesPerRequest: 1
    })
  }

  return redis
}

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const client = getRedis()
  
  if (!client) {
    // No Redis, just execute function
    return await fetchFn()
  }

  try {
    // Try to get from cache
    const cached = await client.get(key)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.error(`Cache read error for ${key}:`, error)
  }

  // Fetch fresh data
  const result = await fetchFn()

  try {
    // Store in cache
    if (ttlSeconds > 0) {
      await client.setex(key, ttlSeconds, JSON.stringify(result))
    }
  } catch (error) {
    console.error(`Cache write error for ${key}:`, error)
  }

  return result
}

export async function getCached<T>(key: string): Promise<T | null> {
  const client = getRedis()
  
  if (!client) return null

  try {
    const cached = await client.get(key)
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error(`Cache read error for ${key}:`, error)
    return null
  }
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  const client = getRedis()
  
  if (!client) return

  try {
    if (ttlSeconds > 0) {
      await client.setex(key, ttlSeconds, JSON.stringify(value))
    } else {
      await client.set(key, JSON.stringify(value))
    }
  } catch (error) {
    console.error(`Cache write error for ${key}:`, error)
  }
} 