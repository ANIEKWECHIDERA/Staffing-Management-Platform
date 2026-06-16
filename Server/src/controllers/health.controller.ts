import type { Request, Response } from "express";

export const getHealth = (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "skillbridge-server",
    timestamp: new Date().toISOString(),
  });
};
