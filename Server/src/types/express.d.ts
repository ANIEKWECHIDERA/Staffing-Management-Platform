import type { JwtPayload } from "jose";
import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload & {
        sub: string;
        email?: string;
        role?: string;
      };
      currentUser?: {
        id: string;
        supabaseUserId: string;
        email: string;
        fullName: string;
        role: UserRole;
        isActive: boolean;
      };
    }
  }
}

export {};
