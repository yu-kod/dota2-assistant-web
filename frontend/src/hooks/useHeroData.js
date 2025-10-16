import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getHeroDetail, getHeroSummaries } from "../services/api";
export function useHeroList(language) {
    return useQuery({
        queryKey: ["heroes", language],
        queryFn: () => getHeroSummaries(language),
        staleTime: 1000 * 60 * 60,
    });
}
export function useHeroDetail(heroId, language) {
    const queryClient = useQueryClient();
    return useQuery({
        queryKey: ["hero", heroId, language],
        enabled: heroId != null,
        queryFn: async () => {
            if (heroId == null) {
                throw new Error("Hero id is required");
            }
            const cachedList = queryClient.getQueryData([
                "heroes",
                language,
            ]);
            if (cachedList) {
                const cachedHero = cachedList.find((hero) => hero.id === heroId);
                if (cachedHero) {
                    queryClient.setQueryData(["hero", heroId, language], cachedHero);
                }
            }
            return getHeroDetail(heroId, language);
        },
    });
}
