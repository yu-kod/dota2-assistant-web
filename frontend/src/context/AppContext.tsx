import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import dayjs from "dayjs";

import { useLocalStorage } from "../hooks/useLocalStorage";
import type { HeroSummary } from "../types/heroes";

export interface HeroHistoryItem {
  hero: HeroSummary;
  timestamp: string;
  language: string;
}

interface AppContextValue {
  selectedHero: HeroSummary | null;
  setSelectedHero: (hero: HeroSummary | null) => void;
  history: HeroHistoryItem[];
  pushHistory: (hero: HeroSummary, language: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  positionOverrides: Record<number, string[]>;
  updateHeroPositions: (heroId: number, positions: string[]) => void;
  clearOverrides: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const HISTORY_STORAGE_KEY = "dota2-assistant-history";
const POSITION_STORAGE_KEY = "dota2-assistant-positions";
const LANGUAGE_STORAGE_KEY = "dota2-assistant-language";

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedHero, setSelectedHero] = useState<HeroSummary | null>(null);
  const [history, setHistory] = useLocalStorage<HeroHistoryItem[]>(
    HISTORY_STORAGE_KEY,
    []
  );
  const [positionOverrides, setPositionOverrides] = useLocalStorage<
    Record<number, string[]>
  >(POSITION_STORAGE_KEY, {});
  const [language, setLanguage] = useLocalStorage<string>(
    LANGUAGE_STORAGE_KEY,
    "english"
  );

  const pushHistory = useCallback(
    (hero: HeroSummary, lang: string) => {
      const entry: HeroHistoryItem = {
        hero,
        language: lang,
        timestamp: dayjs().toISOString(),
      };
      setHistory((prev: HeroHistoryItem[]) => [entry, ...prev].slice(0, 20));
    },
    [setHistory]
  );

  const updateHeroPositions = useCallback(
    (heroId: number, positions: string[]) => {
      setPositionOverrides((prev: Record<number, string[]>) => ({
        ...prev,
        [heroId]: positions,
      }));
    },
    [setPositionOverrides]
  );

  const clearOverrides = useCallback(
    () => setPositionOverrides({}),
    [setPositionOverrides]
  );

  const value = useMemo<AppContextValue>(
    () => ({
      selectedHero,
      setSelectedHero,
      history,
      pushHistory,
      language,
      setLanguage,
      positionOverrides,
      updateHeroPositions,
      clearOverrides,
    }),
    [
      selectedHero,
      history,
      pushHistory,
      language,
      setLanguage,
      positionOverrides,
      updateHeroPositions,
      clearOverrides,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
