import { useEffect, useState } from "react";
export function useLocalStorage(key, defaultValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") {
            return defaultValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        }
        catch (error) {
            console.warn("Failed to parse localStorage value", error);
            return defaultValue;
        }
    });
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        }
        catch (error) {
            console.warn("Failed to set localStorage value", error);
        }
    }, [key, storedValue]);
    return [storedValue, setStoredValue];
}
