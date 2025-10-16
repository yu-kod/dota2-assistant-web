import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState, } from "react";
import dayjs from "dayjs";
import { useLocalStorage } from "../hooks/useLocalStorage";
const AppContext = createContext(undefined);
const HISTORY_STORAGE_KEY = "dota2-assistant-history";
const POSITION_STORAGE_KEY = "dota2-assistant-positions";
const LANGUAGE_STORAGE_KEY = "dota2-assistant-language";
export function AppProvider({ children }) {
    const [selectedHero, setSelectedHero] = useState(null);
    const [history, setHistory] = useLocalStorage(HISTORY_STORAGE_KEY, []);
    const [positionOverrides, setPositionOverrides] = useLocalStorage(POSITION_STORAGE_KEY, {});
    const [language, setLanguage] = useLocalStorage(LANGUAGE_STORAGE_KEY, "english");
    const pushHistory = useCallback((hero, lang) => {
        const entry = {
            hero,
            language: lang,
            timestamp: dayjs().toISOString(),
        };
        setHistory((prev) => [entry, ...prev].slice(0, 20));
    }, [setHistory]);
    const updateHeroPositions = useCallback((heroId, positions) => {
        setPositionOverrides((prev) => ({
            ...prev,
            [heroId]: positions,
        }));
    }, [setPositionOverrides]);
    const clearOverrides = useCallback(() => setPositionOverrides({}), [setPositionOverrides]);
    const value = useMemo(() => ({
        selectedHero,
        setSelectedHero,
        history,
        pushHistory,
        language,
        setLanguage,
        positionOverrides,
        updateHeroPositions,
        clearOverrides,
    }), [
        selectedHero,
        history,
        pushHistory,
        language,
        setLanguage,
        positionOverrides,
        updateHeroPositions,
        clearOverrides,
    ]);
    return _jsx(AppContext.Provider, { value: value, children: children });
}
export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within AppProvider");
    }
    return context;
}
