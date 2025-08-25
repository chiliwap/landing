// Production-grade rate limiting with Upstash Redis, with a dev in-memory fallback.
// - Uses @upstash/ratelimit when UPSTASH_REDIS_REST_URL/TOKEN are configured.
// - Falls back to an in-memory sliding window for local development.

export type RateLimitOptions = {
    windowMs: number; // time window in ms
    limit: number; // max requests per window
};

export type RateLimitResult = {
    ok: boolean;
    remaining: number;
    reset: number; // epoch ms when window resets
};

type AsyncRateLimiter = (
    key: string,
    opts: RateLimitOptions,
) => Promise<RateLimitResult>;

let checkRateLimit: AsyncRateLimiter;

// If Upstash env is present, wire Redis-based limiter, else fallback
if (
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
) {
    // Lazy import to avoid adding dependency weight if not configured
    const { Ratelimit } = require("@upstash/ratelimit");
    const { Redis } = require("@upstash/redis");

    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // We will configure sliding window per call to support dynamic options
    checkRateLimit = async (key: string, opts: RateLimitOptions) => {
        const limiter = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(opts.limit, `${opts.windowMs} ms`),
            analytics: false,
            prefix: "rl",
        });
        const res = await limiter.limit(key);
        return {
            ok: res.success,
            remaining: Math.max(0, res.remaining),
            reset: res.reset,
        };
    };
} else {
    // In-memory sliding-window limiter (dev only). Persist across hot reloads via globalThis
    const globalStore: Map<string, number[]> = (globalThis as any).__rl_store ||
        new Map<string, number[]>();
    if (!(globalThis as any).__rl_store) {
        (globalThis as any).__rl_store = globalStore;
    }

    checkRateLimit = async (
        key: string,
        opts: RateLimitOptions,
    ): Promise<RateLimitResult> => {
        const now = Date.now();
        const windowStart = now - opts.windowMs;
        const arr: number[] = globalStore.get(key) ?? [];
        const recent = arr.filter((ts: number) => ts > windowStart);
        if (recent.length >= opts.limit) {
            const reset = Math.min(...recent) + opts.windowMs;
            return { ok: false, remaining: 0, reset };
        }
        recent.push(now);
        globalStore.set(key, recent);
        return {
            ok: true,
            remaining: Math.max(0, opts.limit - recent.length),
            reset: Math.min(...recent) + opts.windowMs,
        };
    };
}

export async function rateLimit(
    key: string,
    opts: RateLimitOptions,
): Promise<RateLimitResult> {
    return checkRateLimit(key, opts);
}
