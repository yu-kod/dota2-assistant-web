import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.warn("Failed to parse localStorage value", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn("Failed to set localStorage value", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue as Dispatch<SetStateAction<T>>] as const;
}
