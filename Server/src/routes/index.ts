import { Router } from "express";
import { attachCurrentUser } from "../middleware/attach-current-user.js";
import { authenticate } from "../middleware/authenticate.js";
import { authRouter } from "./auth.routes.js";
import { dashboardRouter } from "./dashboard.routes.js";
import { employersRouter } from "./employers.routes.js";
import { healthRouter } from "./health.routes.js";
import { jobRequestsRouter } from "./job-requests.routes.js";
import { matchesRouter } from "./matches.routes.js";
import { placementsRouter } from "./placements.routes.js";
import { uploadsRouter } from "./uploads.routes.js";
import { usersRouter } from "./users.routes.js";
import { workersRouter } from "./workers.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);

apiRouter.use(authenticate, attachCurrentUser);
apiRouter.use("/users", usersRouter);
apiRouter.use("/workers", workersRouter);
apiRouter.use("/employers", employersRouter);
apiRouter.use("/job-requests", jobRequestsRouter);
apiRouter.use("/job-requests/:id/matches", matchesRouter);
apiRouter.use("/placements", placementsRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/uploads", uploadsRouter);
