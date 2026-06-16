import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

const jwks = createRemoteJWKSet(new URL(`${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`));
const issuer = `${env.SUPABASE_URL}/auth/v1`;

const extractBearerToken = (request: Request) => {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice("Bearer ".length);
};

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      throw new AppError("Missing bearer token", 401);
    }

    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience: "authenticated",
    });

    if (!payload.sub) {
      throw new AppError("Invalid token subject", 401);
    }

    req.auth = payload as JWTPayload & {
      sub: string;
      email?: string;
      role?: string;
    };

    next();
  } catch (error) {
    next(error);
  }
};
