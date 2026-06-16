import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";
import { AppError } from "../utils/app-error.js";

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const currentUser = req.currentUser;

    if (!currentUser) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!roles.includes(currentUser.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
};
