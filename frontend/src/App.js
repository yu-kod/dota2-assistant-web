import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Container, Grid, Stack, Typography, } from "@mui/material";
import { HeroCard } from "./components/HeroCard";
import { HeroFilters } from "./components/HeroFilters";
import { HeroHistory } from "./components/HeroHistory";
import { HeroRandomizer } from "./components/HeroRandomizer";
import { useAppContext } from "./context/AppContext";
import { useHeroDetail, useHeroList } from "./hooks/useHeroData";
import { POSITION_OPTIONS } from "./utils/positions";
export default function App() {
    const { selectedHero, setSelectedHero, history, pushHistory, language, setLanguage, positionOverrides, updateHeroPositions, } = useAppContext();
    const [selectedPositions, setSelectedPositions] = useState([]);
    const { data: heroList, isLoading, isError, refetch } = useHeroList(language);
    const defaultPositionsMap = useMemo(() => {
        if (!heroList) {
            return {};
        }
        return heroList.reduce((acc, hero) => {
            acc[hero.id] = hero.positions;
            return acc;
        }, {});
    }, [heroList]);
    const enhancedHeroes = useMemo(() => {
        if (!heroList) {
            return [];
        }
        return heroList.map((hero) => ({
            ...hero,
            positions: positionOverrides[hero.id] ?? hero.positions,
        }));
    }, [heroList, positionOverrides]);
    const filteredHeroes = useMemo(() => {
        if (!selectedPositions.length) {
            return enhancedHeroes;
        }
        return enhancedHeroes.filter((hero) => hero.positions?.some((position) => selectedPositions.includes(position)));
    }, [enhancedHeroes, selectedPositions]);
    const selectedHeroId = selectedHero?.id ?? null;
    const { data: heroDetail, isFetching: isLoadingDetail, refetch: refetchDetail, } = useHeroDetail(selectedHeroId, language);
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
    const handleRandomPick = (hero) => {
        setSelectedHero(hero);
        pushHistory(hero, language);
    };
    const handleLanguageChange = (value) => {
        setLanguage(value);
        refetch();
        if (selectedHero) {
            refetchDetail();
        }
    };
    return (_jsx(Container, { maxWidth: "lg", sx: { py: 4 }, children: _jsxs(Stack, { spacing: 3, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h4", fontWeight: 700, gutterBottom: true, children: "Dota 2 Hero Assistant" }), _jsx(Typography, { variant: "subtitle1", color: "text.secondary", children: "\u30E9\u30F3\u30C0\u30E0\u30D4\u30C3\u30AF\u3068\u30DD\u30B8\u30B7\u30E7\u30F3\u6700\u9069\u5316\u3067\u3001\u65B0\u9BAE\u306A\u30D2\u30FC\u30ED\u30FC\u4F53\u9A13\u3092\u30B5\u30DD\u30FC\u30C8\u3057\u307E\u3059\u3002" })] }), _jsx(HeroFilters, { language: language, onLanguageChange: handleLanguageChange, positions: POSITION_OPTIONS, selectedPositions: selectedPositions, onPositionsChange: setSelectedPositions, heroCount: filteredHeroes.length }), isError ? (_jsx(Alert, { severity: "error", onClose: () => refetch(), children: "\u30D2\u30FC\u30ED\u30FC\u60C5\u5831\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u72B6\u614B\u3092\u78BA\u8A8D\u3057\u3066\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002" })) : null, _jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, md: 5, children: [isLoading ? (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", height: 320, children: _jsx(CircularProgress, {}) })) : (_jsx(HeroRandomizer, { heroes: filteredHeroes, onRandomPick: handleRandomPick, selectedHeroId: selectedHeroId })), _jsx(Box, { mt: 3, children: _jsx(HeroHistory, { items: history, onSelect: setSelectedHero }) })] }), _jsx(Grid, { item: true, xs: 12, md: 7, children: selectedHero ? (_jsx(HeroCard, { hero: (displayHero ?? selectedHero), loading: isLoadingDetail && !heroDetail, availablePositions: POSITION_OPTIONS, defaultPositions: selectedHero
                                    ? defaultPositionsMap[selectedHero.id] ??
                                        selectedHero.positions
                                    : [], onPositionsChange: (positions) => {
                                    if (selectedHero) {
                                        updateHeroPositions(selectedHero.id, positions);
                                        setSelectedHero({ ...selectedHero, positions });
                                    }
                                } })) : (_jsxs(Box, { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, bgcolor: "background.paper", borderRadius: 2, border: "1px solid rgba(255, 255, 255, 0.08)", children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "\u30D2\u30FC\u30ED\u30FC\u3092\u30E9\u30F3\u30C0\u30E0\u30D4\u30C3\u30AF\u3057\u3066\u8A73\u7D30\u3092\u8868\u793A\u3057\u307E\u3057\u3087\u3046" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "\u5DE6\u306E\u300C\u30E9\u30F3\u30C0\u30E0\u30D4\u30C3\u30AF\u300D\u30DC\u30BF\u30F3\u3092\u62BC\u3059\u3068\u5019\u88DC\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002" })] })) })] })] }) }));
}
