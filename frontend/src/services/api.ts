import axios from "axios";

import type { HeroDetail, HeroSummary } from "../types/heroes";

const apiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    ""
  ) || "/api";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

export async function getHeroSummaries(
  language?: string
): Promise<HeroSummary[]> {
  const response = await apiClient.get<{ heroes: HeroSummary[] }>(`/heroes`, {
    params: language ? { language } : undefined,
  });
  return response.data.heroes;
}

export async function getHeroDetail(
  heroId: number,
  language?: string
): Promise<HeroDetail> {
  const response = await apiClient.get<{ hero: HeroDetail }>(
    `/heroes/${heroId}`,
    {
      params: language ? { language } : undefined,
    }
  );
  return response.data.hero;
}
