import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderState {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderState>({
	theme: "system",
	setTheme: () => {},
});

const STORAGE_KEY = "vite-ui-theme";

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme?: Theme;
}

export function ThemeProvider({
	children,
	defaultTheme = "system",
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		() => (localStorage.getItem(STORAGE_KEY) as Theme) || defaultTheme,
	);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches
				? "dark"
				: "light";
			root.classList.add(systemTheme);
		} else {
			root.classList.add(theme);
		}
	}, [theme]);

	return (
		<ThemeProviderContext.Provider
			value={{
				theme,
				setTheme: (theme: Theme) => {
					localStorage.setItem(STORAGE_KEY, theme);
					setTheme(theme);
				},
			}}
		>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeProviderContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
