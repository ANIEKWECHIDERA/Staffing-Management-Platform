import cors, { type CorsOptions } from "cors";
import type { Request, RequestHandler } from "express";
import helmet from "helmet";
import { env } from "../config/env.js";

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  message: string;
  skip?: (req: Request) => boolean;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, "");

const allowedOrigins = new Set([normalizeOrigin(env.FRONTEND_URL)]);

const corsOriginValidator: CorsOptions["origin"] = (origin, callback) => {
  if (!origin) {
    callback(null, true);
    return;
  }

  if (allowedOrigins.has(normalizeOrigin(origin))) {
    callback(null, true);
    return;
  }

  callback(new Error("Origin not allowed by CORS"));
};

export const corsMiddleware = cors({
  origin: corsOriginValidator,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
  optionsSuccessStatus: 204,
  maxAge: 60 * 60 * 24,
});

export const securityHeadersMiddleware = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "no-referrer" },
  contentSecurityPolicy: false,
});

const createRateLimiter = ({ windowMs, maxRequests, message, skip }: RateLimitOptions): RequestHandler => {
  const store = new Map<string, RateLimitEntry>();

  return (req, res, next) => {
    if (env.NODE_ENV === "test" || skip?.(req)) {
      next();
      return;
    }

    const now = Date.now();
    const key = req.ip || "unknown";
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
      store.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });

      res.setHeader("X-RateLimit-Limit", maxRequests.toString());
      res.setHeader("X-RateLimit-Remaining", Math.max(maxRequests - 1, 0).toString());
      res.setHeader("X-RateLimit-Reset", Math.ceil((now + windowMs) / 1000).toString());
      next();
      return;
    }

    existing.count += 1;
    store.set(key, existing);

    const remaining = Math.max(maxRequests - existing.count, 0);
    res.setHeader("X-RateLimit-Limit", maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", remaining.toString());
    res.setHeader("X-RateLimit-Reset", Math.ceil(existing.resetAt / 1000).toString());

    if (existing.count > maxRequests) {
      const retryAfterSeconds = Math.max(Math.ceil((existing.resetAt - now) / 1000), 1);
      res.setHeader("Retry-After", retryAfterSeconds.toString());
      res.status(429).json({
        message,
      });
      return;
    }

    if (store.size > 5000) {
      for (const [entryKey, entry] of store.entries()) {
        if (entry.resetAt <= now) {
          store.delete(entryKey);
        }
      }
    }

    next();
  };
};

export const authRateLimitMiddleware = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
  message: "Too many authentication requests. Please try again later.",
});

export const apiRateLimitMiddleware = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 300,
  message: "Too many API requests. Please try again later.",
  skip: (req) => req.path === "/health",
});
