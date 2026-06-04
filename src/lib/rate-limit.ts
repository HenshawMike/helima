/**
 * Rate limiter with dual-mode support:
 *  - In-memory (default): suitable for single-server / dev deployments
 *  - Redis adapter: for serverless / multi-instance production deployments
 *
 * Usage:
 *   const limiter = createRateLimiter({ interval: 60_000, maxRequests: 10 });
 *   const { success } = await limiter.check(identifier);
 */

interface RateLimitOptions {
  /** Time window in milliseconds */
  interval: number;
  /** Maximum number of requests per interval */
  maxRequests: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

interface RateLimitStore {
  check(key: string): Promise<RateLimitResult>;
}

// ─── In-memory store ─────────────────────────────────────────────
// Good for single-server deployments (Next.js standalone, VPS, etc.)
class MemoryStore implements RateLimitStore {
  private records = new Map<string, { count: number; resetAt: number }>();
  private readonly interval: number;
  private readonly maxRequests: number;

  constructor(opts: RateLimitOptions) {
    this.interval = opts.interval;
    this.maxRequests = opts.maxRequests;

    // Periodic cleanup to avoid unbounded memory growth
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.records) {
        if (now >= record.resetAt) {
          this.records.delete(key);
        }
      }
    }, this.interval * 2);

    // Don't prevent Node from exiting
    if (cleanupInterval.unref) {
      cleanupInterval.unref();
    }
  }

  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const existing = this.records.get(key);

    if (!existing || now >= existing.resetAt) {
      // Start a new window
      const resetAt = now + this.interval;
      this.records.set(key, { count: 1, resetAt });
      return { success: true, remaining: this.maxRequests - 1, resetAt };
    }

    if (existing.count >= this.maxRequests) {
      return { success: false, remaining: 0, resetAt: existing.resetAt };
    }

    existing.count++;
    return {
      success: true,
      remaining: this.maxRequests - existing.count,
      resetAt: existing.resetAt,
    };
  }
}

// ─── Redis store ─────────────────────────────────────────────────
// For serverless / multi-instance deployments. Requires a Redis client
// that exposes `multi().incr().expire().exec()` (e.g., ioredis or @upstash/redis).
// To activate: set REDIS_URL env var and install your Redis client of choice.
//
// Example with ioredis:
//   import Redis from 'ioredis';
//   const redis = new Redis(process.env.REDIS_URL);
//   const limiter = createRateLimiter({ interval: 60_000, maxRequests: 10 }, redis);

interface RedisClient {
  multi(): {
    incr(key: string): unknown;
    expire(key: string, seconds: number): unknown;
    exec(): Promise<Array<[Error | null, number]>>;
  };
}

class RedisStore implements RateLimitStore {
  private readonly redis: RedisClient;
  private readonly interval: number;
  private readonly maxRequests: number;
  private readonly prefix: string;

  constructor(opts: RateLimitOptions, redis: RedisClient, prefix = 'rl:') {
    this.redis = redis;
    this.interval = opts.interval;
    this.maxRequests = opts.maxRequests;
    this.prefix = prefix;
  }

  async check(key: string): Promise<RateLimitResult> {
    const redisKey = `${this.prefix}${key}`;
    const ttlSeconds = Math.ceil(this.interval / 1000);

    const results = await this.redis
      .multi()
      .incr(redisKey)
      .expire(redisKey, ttlSeconds)
      .exec();

    const count = (results?.[0]?.[1] as number) ?? 1;
    const resetAt = Date.now() + this.interval;

    if (count > this.maxRequests) {
      return { success: false, remaining: 0, resetAt };
    }

    return {
      success: true,
      remaining: this.maxRequests - count,
      resetAt,
    };
  }
}

// ─── Factory ─────────────────────────────────────────────────────

export function createRateLimiter(
  opts: RateLimitOptions,
  redis?: RedisClient
): RateLimitStore {
  if (redis) {
    return new RedisStore(opts, redis);
  }
  return new MemoryStore(opts);
}

// ─── Pre-configured limiters ────────────────────────────────────

/** Payment endpoint: 5 requests per 60 seconds per IP */
export const paymentLimiter = createRateLimiter({
  interval: 60_000,
  maxRequests: 5,
});

/** General API: 30 requests per 60 seconds per IP */
export const apiLimiter = createRateLimiter({
  interval: 60_000,
  maxRequests: 30,
});

/**
 * Extract client IP from request headers.
 * Works with Vercel, Cloudflare, and standard proxies.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}
