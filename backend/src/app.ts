import cors from "cors";
import express, {
  json,
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { ALLOWED_ORIGINS } from "./config.js";
import { heroesRouter } from "./routes/heroes.js";

const app = express();

const corsOptions = ALLOWED_ORIGINS
  ? {
      origin: ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()),
      credentials: true,
    }
  : undefined;

app.use(cors(corsOptions));
app.use(json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/heroes", heroesRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unexpected error", err);
  res.status(500).json({ message: "Internal server error" });
});

export { app };
