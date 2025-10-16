import type { Request, Response } from "express";
import { Router } from "express";

import { DEFAULT_LANGUAGE } from "../config.js";
import { fetchHeroDetail, fetchHeroSummaries } from "../services/dotaApi.js";

export const heroesRouter = Router();

heroesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const language =
      typeof req.query.language === "string"
        ? req.query.language
        : DEFAULT_LANGUAGE;
    const heroes = await fetchHeroSummaries(language);
    res.json({ heroes, language });
  } catch (error) {
    console.error("Failed to fetch hero summaries", error);
    res.status(500).json({ message: "Failed to fetch hero list" });
  }
});

heroesRouter.get("/:heroId", async (req: Request, res: Response) => {
  try {
    const heroId = Number.parseInt(req.params.heroId, 10);
    if (Number.isNaN(heroId)) {
      res.status(400).json({ message: "Invalid hero id" });
      return;
    }

    const language =
      typeof req.query.language === "string"
        ? req.query.language
        : DEFAULT_LANGUAGE;
    const hero = await fetchHeroDetail(heroId, language);
    res.json({ hero, language });
  } catch (error) {
    console.error("Failed to fetch hero detail", error);
    res.status(500).json({ message: "Failed to fetch hero detail" });
  }
});
