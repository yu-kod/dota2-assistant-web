import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { HeroDetail, HeroSummary } from "../types/heroes";
import { getHeroDetail, getHeroSummaries } from "../services/api";

export function useHeroList(language: string) {
  return useQuery<HeroSummary[]>({
    queryKey: ["heroes", language],
    queryFn: () => getHeroSummaries(language),
    staleTime: 1000 * 60 * 60,
  });
}

export function useHeroDetail(heroId: number | null, language: string) {
  const queryClient = useQueryClient();

  return useQuery<HeroDetail>({
    queryKey: ["hero", heroId, language],
    enabled: heroId != null,
    queryFn: async () => {
      if (heroId == null) {
        throw new Error("Hero id is required");
      }

      const cachedList = queryClient.getQueryData<HeroSummary[]>([
        "heroes",
        language,
      ]);
      if (cachedList) {
        const cachedHero = cachedList.find(
          (hero: HeroSummary) => hero.id === heroId
        );
        if (cachedHero) {
          queryClient.setQueryData(
            ["hero", heroId, language],
            cachedHero as HeroDetail
          );
        }
      }

      return getHeroDetail(heroId, language);
    },
  });
}
