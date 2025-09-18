"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const current = theme === "system" ? systemTheme : theme;
    if (!mounted) return null;
    const isDark = current !== "light";
    return (
        <button
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="btn"
        >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}


