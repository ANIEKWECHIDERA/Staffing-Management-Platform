import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";

export const attachCurrentUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const supabaseUserId = req.auth?.sub;

    if (!supabaseUserId) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { supabaseUserId },
    });

    if (!user || !user.isActive) {
      throw new AppError("User is not active in SkillBridge OS", 403);
    }

    req.currentUser = {
      id: user.id,
      supabaseUserId: user.supabaseUserId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    next(error);
  }
};
