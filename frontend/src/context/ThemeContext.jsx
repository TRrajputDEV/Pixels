// src/context/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Use lazy initialization to read from localStorage synchronously
    const [theme, setTheme] = useState(() => {
        // Check if we're in browser environment
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem("theme");
            if (storedTheme) {
                return storedTheme;
            }
            // Fallback to system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            return prefersDark ? "dark" : "light";
        }
        return "light"; // SSR fallback
    });

    // Apply theme to DOM and save to localStorage whenever theme changes
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
