import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const toggleTheme = () => {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("system");
		} else {
			setTheme("light");
		}
	};

	const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

	return (
		<Button variant="ghost" size="icon" onClick={toggleTheme}>
			<Icon className="size-4" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
