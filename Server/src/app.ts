import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import {
  apiRateLimitMiddleware,
  authRateLimitMiddleware,
  corsMiddleware,
  securityHeadersMiddleware,
} from "./middleware/security.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(corsMiddleware);
app.use(securityHeadersMiddleware);
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "250kb", parameterLimit: 50 }),
);
app.use(cookieParser());
app.use("/api/v1/auth", authRateLimitMiddleware);
app.use("/api/v1", apiRateLimitMiddleware);

app.get("/check", (_req, res) => {
  res.json({
    message: "SkillBridge OS API",
    version: "v1",
  });
});

app.use("/api/v1", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
