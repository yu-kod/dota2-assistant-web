import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { HeroCard } from "./components/HeroCard";
import { HeroFilters } from "./components/HeroFilters";
import { HeroHistory } from "./components/HeroHistory";
import { HeroRandomizer } from "./components/HeroRandomizer";
import { useAppContext } from "./context/AppContext";
import { useHeroDetail, useHeroList } from "./hooks/useHeroData";
import type { HeroSummary } from "./types/heroes";
import { POSITION_OPTIONS } from "./utils/positions";

export default function App() {
  const {
    selectedHero,
    setSelectedHero,
    history,
    pushHistory,
    language,
    setLanguage,
    positionOverrides,
    updateHeroPositions,
  } = useAppContext();
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  const { data: heroList, isLoading, isError, refetch } = useHeroList(language);

  const defaultPositionsMap = useMemo(() => {
    if (!heroList) {
      return {} as Record<number, string[]>;
    }
    return heroList.reduce(
      (acc: Record<number, string[]>, hero: HeroSummary) => {
        acc[hero.id] = hero.positions;
        return acc;
      },
      {} as Record<number, string[]>
    );
  }, [heroList]);

  const enhancedHeroes = useMemo(() => {
    if (!heroList) {
      return [] as HeroSummary[];
    }
    return heroList.map((hero: HeroSummary) => ({
      ...hero,
      positions: positionOverrides[hero.id] ?? hero.positions,
    }));
  }, [heroList, positionOverrides]);

  const filteredHeroes = useMemo(() => {
    if (!selectedPositions.length) {
      return enhancedHeroes;
    }
    return enhancedHeroes.filter((hero: HeroSummary) =>
      hero.positions?.some((position: string) =>
        selectedPositions.includes(position)
      )
    );
  }, [enhancedHeroes, selectedPositions]);

  const selectedHeroId = selectedHero?.id ?? null;
  const {
    data: heroDetail,
    isFetching: isLoadingDetail,
    refetch: refetchDetail,
  } = useHeroDetail(selectedHeroId, language);

  const displayHero = useMemo(() => {
    if (heroDetail) {
      return {
        ...heroDetail,
        positions: positionOverrides[heroDetail.id] ?? heroDetail.positions,
      };
    }
    if (selectedHero) {
      return {
        ...selectedHero,
        positions: positionOverrides[selectedHero.id] ?? selectedHero.positions,
      };
    }
    return null;
  }, [heroDetail, selectedHero, positionOverrides]);

  const handleRandomPick = (hero: HeroSummary) => {
    setSelectedHero(hero);
    pushHistory(hero, language);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    refetch();
    if (selectedHero) {
      refetchDetail();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Dota 2 Hero Assistant
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            ランダムピックとポジション最適化で、新鮮なヒーロー体験をサポートします。
          </Typography>
        </Box>

        <HeroFilters
          language={language}
          onLanguageChange={handleLanguageChange}
          positions={POSITION_OPTIONS}
          selectedPositions={selectedPositions}
          onPositionsChange={setSelectedPositions}
          heroCount={filteredHeroes.length}
        />

        {isError ? (
          <Alert severity="error" onClose={() => refetch()}>
            ヒーロー情報の取得に失敗しました。ネットワーク状態を確認して再度お試しください。
          </Alert>
        ) : null}

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={320}
              >
                <CircularProgress />
              </Box>
            ) : (
              <HeroRandomizer
                heroes={filteredHeroes}
                onRandomPick={handleRandomPick}
                selectedHeroId={selectedHeroId}
              />
            )}
            <Box mt={3}>
              <HeroHistory items={history} onSelect={setSelectedHero} />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            {selectedHero ? (
              <HeroCard
                hero={(displayHero ?? selectedHero)!}
                loading={isLoadingDetail && !heroDetail}
                availablePositions={POSITION_OPTIONS}
                defaultPositions={
                  selectedHero
                    ? defaultPositionsMap[selectedHero.id] ??
                      selectedHero.positions
                    : []
                }
                onPositionsChange={(positions: string[]) => {
                  if (selectedHero) {
                    updateHeroPositions(selectedHero.id, positions);
                    setSelectedHero({ ...selectedHero, positions });
                  }
                }}
              />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height={400}
                bgcolor="background.paper"
                borderRadius={2}
                border="1px solid rgba(255, 255, 255, 0.08)"
              >
                <Typography variant="h6" gutterBottom>
                  ヒーローをランダムピックして詳細を表示しましょう
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  左の「ランダムピック」ボタンを押すと候補が表示されます。
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
